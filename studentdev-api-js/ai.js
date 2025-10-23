// ai.js - Enhanced Universal AI Chatbot for StudentDev
import { getPool } from "./db.js";
import { requireAuth } from "./authMiddleware.js";

export function registerAIRoutes(app) {
  // POST /api/ai/chat - Enhanced Streaming AI chat
  app.post("/api/ai/chat", requireAuth, async (req, res) => {
    try {
      const { message, sessionId } = req.body;
      const userId = req.user.id;

      if (!message || message.trim().length === 0) {
        return res.status(400).json({ error: "Message is required" });
      }

      const pool = await getPool();

      // Get or create chat session
      let chatSessionId = sessionId;
      if (!chatSessionId) {
        const [sessionResult] = await pool.execute(
          "INSERT INTO chat_sessions (user_id) VALUES (?)",
          [userId]
        );
        chatSessionId = sessionResult.insertId;
      } else {
        // Verify session belongs to user
        const [sessionCheck] = await pool.execute(
          "SELECT id FROM chat_sessions WHERE id = ? AND user_id = ?",
          [chatSessionId, userId]
        );
        if (sessionCheck.length === 0) {
          return res.status(404).json({ error: "Session not found" });
        }
      }

      // Save user message
      await pool.execute(
        "INSERT INTO chat_messages (session_id, sender, content) VALUES (?, 'user', ?)",
        [chatSessionId, message.trim()]
      );

      // Set headers for NDJSON streaming
      res.writeHead(200, {
        'Content-Type': 'application/x-ndjson',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      });

      // Generate AI response
      const aiResponse = await generateEnhancedResponse(message, userId, pool);
      
      // Save AI response to database first (for data integrity)
      await pool.execute(
        "INSERT INTO chat_messages (session_id, sender, content) VALUES (?, 'assistant', ?)",
        [chatSessionId, aiResponse]
      );

      // Enhanced streaming - by sentences to prevent corruption
      const paragraphs = aiResponse.split('\n\n');
      
      for (let p = 0; p < paragraphs.length; p++) {
        const paragraph = paragraphs[p];
        const sentences = paragraph.split(/(?<=[.!?])\s+/);
        
        for (let s = 0; s < sentences.length; s++) {
          const sentence = sentences[s];
          if (!sentence.trim()) continue;
          
          // Send token event for each sentence
          const tokenEvent = {
            type: "token",
            delta: sentence + (s < sentences.length - 1 ? ' ' : '')
          };
          res.write(JSON.stringify(tokenEvent) + '\n');
          
          // Natural typing speed between sentences
          await new Promise(resolve => setTimeout(resolve, 80 + Math.random() * 120));
        }
        
        // Add paragraph breaks
        if (p < paragraphs.length - 1) {
          const breakEvent = {
            type: "token",
            delta: '\n\n'
          };
          res.write(JSON.stringify(breakEvent) + '\n');
          await new Promise(resolve => setTimeout(resolve, 50));
        }
      }
      
      // Send final event
      const finalEvent = {
        type: "final",
        reply: aiResponse,
        links: []
      };
      res.write(JSON.stringify(finalEvent) + '\n');

      res.end();

    } catch (error) {
      console.error("AI chat error:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: "AI service unavailable" });
      } else {
        // If streaming already started, send error as final event
        const errorEvent = {
          type: "final",
          reply: "Sorry — something went wrong. Please try again.",
          links: []
        };
        res.write(JSON.stringify(errorEvent) + '\n');
        res.end();
      }
    }
  });

  // GET /api/ai/sessions - Get user's chat sessions
  app.get("/api/ai/sessions", requireAuth, async (req, res) => {
    try {
      const pool = await getPool();
      const [sessions] = await pool.execute(
        `SELECT cs.id, cs.created_at, cs.closed_at,
                (SELECT content FROM chat_messages 
                 WHERE session_id = cs.id AND sender = 'user'
                 ORDER BY id ASC LIMIT 1) as first_message
         FROM chat_sessions cs 
         WHERE cs.user_id = ? 
         ORDER BY cs.created_at DESC`,
        [req.user.id]
      );
      res.json({ sessions });
    } catch (error) {
      console.error("AI sessions error:", error);
      res.status(500).json({ error: "Failed to fetch sessions" });
    }
  });

  // GET /api/ai/messages/:sessionId - Get messages for a session
  app.get("/api/ai/messages/:sessionId", requireAuth, async (req, res) => {
    try {
      const { sessionId } = req.params;
      const pool = await getPool();

      // Verify session belongs to user
      const [sessionCheck] = await pool.execute(
        "SELECT id FROM chat_sessions WHERE id = ? AND user_id = ?",
        [sessionId, req.user.id]
      );

      if (sessionCheck.length === 0) {
        return res.status(404).json({ error: "Session not found" });
      }

      const [messages] = await pool.execute(
        `SELECT id, sender, content, links_json, created_at 
         FROM chat_messages 
         WHERE session_id = ? 
         ORDER BY created_at ASC`,
        [sessionId]
      );

      res.json({ messages });
    } catch (error) {
      console.error("AI messages error:", error);
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  // DELETE /api/ai/sessions/:sessionId - Delete a chat session
  app.delete("/api/ai/sessions/:sessionId", requireAuth, async (req, res) => {
    try {
      const { sessionId } = req.params;
      const pool = await getPool();

      const [result] = await pool.execute(
        "DELETE FROM chat_sessions WHERE id = ? AND user_id = ?",
        [sessionId, req.user.id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Session not found" });
      }

      res.json({ ok: true });
    } catch (error) {
      console.error("AI session delete error:", error);
      res.status(500).json({ error: "Failed to delete session" });
    }
  });

  // POST /api/ai/sessions/:sessionId/close - Close a chat session
  app.post("/api/ai/sessions/:sessionId/close", requireAuth, async (req, res) => {
    try {
      const { sessionId } = req.params;
      const pool = await getPool();

      const [result] = await pool.execute(
        "UPDATE chat_sessions SET closed_at = NOW() WHERE id = ? AND user_id = ?",
        [sessionId, req.user.id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Session not found" });
      }

      res.json({ ok: true });
    } catch (error) {
      console.error("AI session close error:", error);
      res.status(500).json({ error: "Failed to close session" });
    }
  });
}

// Enhanced response generator with detailed answers
async function generateEnhancedResponse(message, userId, pool) {
  try {
    const lowerMessage = message.toLowerCase();
    
    // Get user profile for personalization
    const [userProfile] = await pool.execute(
      `SELECT u.role, up.display_name 
       FROM users u 
       LEFT JOIN user_profiles up ON u.id = up.user_id 
       WHERE u.id = ?`,
      [userId]
    );

    const userRole = userProfile[0]?.role || 'student';
    const userName = userProfile[0]?.display_name || 'Student';

    // Get relevant learning resources
    const [relevantResources] = await pool.execute(
      `SELECT title, description, url, type, level 
       FROM resources 
       WHERE title LIKE ? OR description LIKE ? 
       LIMIT 3`,
      [`%${message}%`, `%${message}%`]
    );

    return generateComprehensiveResponse(message, relevantResources, userRole, userName);
  } catch (error) {
    console.error("Response generation error:", error);
    return generateEnhancedFallback(message);
  }
}

function generateComprehensiveResponse(message, resources, role, name) {
  const lowerMessage = message.toLowerCase();
  const questionType = detectQuestionType(message);
  
  switch (questionType) {
    case 'programming':
      return generateDetailedProgrammingResponse(message, resources, role);
    case 'learning':
      return generateDetailedLearningResponse(message, resources, role);
    case 'career':
      return generateDetailedCareerResponse(message, resources, role);
    case 'technical':
      return generateDetailedTechnicalResponse(message, resources, role);
    case 'conceptual':
      return generateDetailedConceptualResponse(message, resources, role);
    case 'personal':
      return generateEnhancedPersonalResponse(message, name);
    case 'fun':
      return generateEnhancedFunResponse(message);
    default:
      return generateEnhancedGeneralResponse(message, resources, role, name);
  }
}

function detectQuestionType(message) {
  const lowerMessage = message.toLowerCase();
  
  const patterns = {
    programming: /(javascript|python|java|react|node|html|css|sql|git|code|program|function|variable|loop|array|object|class|method|api|debug)/,
    learning: /(learn|study|practice|understand|master|skill|course|tutorial|teach|education|knowledge)/,
    career: /(career|job|interview|resume|portfolio|hire|salary|work|professional|industry)/,
    technical: /(how to|how do i|how can i|steps to|guide to|tutorial on)/,
    conceptual: /(what is|explain|define|meaning of|difference between|compare|contrast)/,
    personal: /(you |your|who are|what can you|help me|advice|suggestion)/,
    fun: /(hello|hi|hey|good morning|good afternoon|thanks|thank you|joke|fun|haha|lol)/
  };

  for (const [type, pattern] of Object.entries(patterns)) {
    if (pattern.test(lowerMessage)) return type;
  }
  
  return 'general';
}

function generateDetailedProgrammingResponse(message, resources, role) {
  const responses = [
    `**Programming Question: "${message}"** 🚀

This is a great technical question! Let me break it down:

**Core Concept:**
Programming is about solving problems systematically. When approaching "${message}", consider:

• **Fundamentals First**: Understand the basic principles
• **Practice Regularly**: Code daily to build muscle memory
• **Read Documentation**: Official docs are your best friend
• **Debug Methodically**: Use console logs and debuggers

**Best Practices:**
- Write clean, readable code with meaningful names
- Test your code thoroughly
- Learn from code reviews
- Keep learning new technologies

${formatEnhancedResources(resources, '💻 Programming Resources:')}`,

    `**"${message}" - Technical Deep Dive** 🔍

Excellent programming question! Here's my comprehensive approach:

**Problem-Solving Framework:**
1. **Understand**: Break down the problem completely
2. **Plan**: Write pseudocode or draw diagrams
3. **Implement**: Code step by step
4. **Test**: Verify with different inputs
5. **Refactor**: Improve code quality

**Key Insights:**
• Programming is a craft that improves with practice
• Don't be afraid to make mistakes - they're learning opportunities
• The best programmers are lifelong learners

${formatEnhancedResources(resources, '📚 Learning Materials:')}`,

    `**Addressing "${message}"** 💡

As a programming tutor, I love questions like this! Here's my perspective:

**Development Mindset:**
• **Growth Oriented**: Embrace challenges as learning opportunities
• **Detail Focused**: Pay attention to edge cases and error handling
• **User Centric**: Consider how others will use and maintain your code

**Technical Strategy:**
- Start with a minimal working example
- Add complexity gradually
- Use version control (Git) from day one
- Document your thought process

${formatEnhancedResources(resources, '🛠️ Code Resources:')}`
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}

function generateDetailedLearningResponse(message, resources, role) {
  const responses = [
    `**Learning Strategy: "${message}"** 📖

Mastering new skills requires a systematic approach:

**Effective Learning Framework:**
🎯 **Set Clear Goals**: Define what success looks like
📚 **Gather Resources**: Use multiple learning materials  
🛠️ **Practice Actively**: Apply knowledge immediately
🔁 **Review Regularly**: Spaced repetition for retention
📊 **Track Progress**: Celebrate small victories

**Pro Tips:**
• Teach others to solidify your understanding
• Create projects that excite you
• Join learning communities for support
• Embrace the struggle - it means you're growing

${formatEnhancedResources(resources, '🎓 Learning Resources:')}`,

    `**"${message}" - Learning Excellence** 🌟

Great question about skill development! Here's my proven approach:

**The Learning Pyramid:**
1. **Foundation** (10%): Understand basic concepts
2. **Application** (30%): Practice with exercises
3. **Integration** (40%): Build real projects
4. **Mastery** (20%): Teach and refine

**Key Principles:**
• Consistency beats intensity (30 mins daily > 4 hours weekly)
• Focus on understanding, not memorization
• Learn in context - connect to real-world problems
• Get feedback early and often

${formatEnhancedResources(resources, '📖 Study Materials:')}`
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}

function generateDetailedCareerResponse(message, resources, role) {
  const responses = [
    `**Career Development: "${message}"** 💼

Building a successful tech career requires strategy:

**Career Growth Framework:**
🚀 **Skill Development**: Master in-demand technologies
📈 **Portfolio Building**: Create impressive projects
🤝 **Networking**: Connect with industry professionals
🎯 **Job Search**: Target companies that align with your goals

**Key Advice:**
• Specialize in a niche but stay versatile
• Contribute to open source projects
• Attend tech meetups and conferences
• Never stop learning new technologies

**Interview Preparation:**
- Practice coding challenges regularly
- Prepare behavioral questions
- Research companies thoroughly
- Mock interviews with peers

${formatEnhancedResources(resources, '🏢 Career Resources:')}`
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}

function generateDetailedTechnicalResponse(message, resources, role) {
  const topic = extractMainTopic(message);
  
  const responses = [
    `**Technical Guide: "${message}"** 🛠️

Let me provide a step-by-step approach:

**Problem Analysis:**
1. **Define Requirements**: What exactly needs to be accomplished?
2. **Identify Constraints**: What limitations exist?
3. **Research Solutions**: What approaches have others used?
4. **Plan Implementation**: How will you build the solution?

**Implementation Strategy:**
• Start with a simple prototype
• Test each component independently
• Document your code as you go
• Optimize only after it works

**Debugging Tips:**
- Use systematic debugging techniques
- Leverage developer tools
- Read error messages carefully
- Ask for help when stuck

${formatEnhancedResources(resources, '🔧 Technical Resources:')}`,

    `**"${message}" - Technical Breakdown** 🔬

Excellent technical question! Here's my comprehensive approach:

**Development Process:**
🎨 **Design Phase**: Plan your architecture and data flow
⚡ **Implementation**: Code with best practices in mind
🧪 **Testing**: Verify functionality and edge cases
📈 **Optimization**: Improve performance and readability

**Best Practices:**
• Write self-documenting code
• Use version control effectively
• Follow coding standards
• Conduct code reviews

${formatEnhancedResources(resources, '📐 Implementation Guides:')}`
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}

function generateDetailedConceptualResponse(message, resources, role) {
  const responses = [
    `**Conceptual Understanding: "${message}"** 🧠

Let me explain this concept comprehensively:

**Core Definition:**
At its heart, this concept represents a fundamental principle in computing/learning. Understanding it deeply will help you grasp more complex topics.

**Key Components:**
• **Fundamental Principle**: The basic idea behind the concept
• **Practical Applications**: Where and how it's used in real-world scenarios
• **Common Misconceptions**: What people often get wrong
• **Related Concepts**: How it connects to other ideas

**Learning Approach:**
1. Start with simple analogies
2. Build mental models
3. Apply in practical examples
4. Connect to existing knowledge

**Deep Understanding:**
- Ask "why" repeatedly to get to first principles
- Explore different perspectives and use cases
- Discuss with peers to solidify understanding
- Apply the concept in various contexts

${formatEnhancedResources(resources, '📚 Conceptual Resources:')}`
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}

function generateEnhancedPersonalResponse(message, name) {
  const responses = [
    `👋 **Hello${name ? ' ' + name : ''}! I'm Your AI Learning Assistant**

**What I Can Help With:**
🎯 **Programming & Development**: JavaScript, React, Node.js, Python, and more
📚 **Learning Strategies**: Study techniques, skill acquisition, knowledge retention  
💼 **Career Guidance**: Interview prep, portfolio building, career planning
🔧 **Technical Problems**: Debugging, architecture, best practices
🎓 **Educational Support**: Course guidance, project ideas, resource recommendations

**My Approach:**
• Providing practical, actionable advice
• Offering multiple perspectives on problems
• Connecting concepts to real-world applications
• Supporting your unique learning journey

**How to Get the Most Value:**
- Ask specific questions for detailed answers
- Share your current understanding level
- Let me know your learning goals
- Don't hesitate to ask for clarification

What would you like to explore today? 🚀`,

    `🤖 **Greetings${name ? ' ' + name : ''}! I'm Your AI Programming Tutor**

**My Expertise Areas:**
💻 **Frontend Development**: HTML, CSS, JavaScript, React, Vue
⚙️ **Backend Development**: Node.js, Python, APIs, Databases
📱 **Full Stack Projects**: End-to-end application development
🎨 **Software Architecture**: Design patterns, system design, scalability
📊 **Algorithms & Data Structures**: Problem-solving, optimization, efficiency

**How I Can Assist You:**
• Explaining complex technical concepts simply
• Providing step-by-step learning paths
• Recommending the best resources and tools
• Helping debug and solve coding challenges
• Guiding career and skill development

**Let's Build Something Amazing Together!**
What programming concept or learning challenge can I help you with today? 💡`
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}

function generateEnhancedFunResponse(message) {
  const responses = [
    `🎉 **Hey there! Let's make learning fun!** 

Why did the programmer quit his job? 
Because he didn't get arrays! 😄

But seriously, I'm here to help you learn programming and development in an engaging way. Whether you're debugging tricky code, learning new frameworks, or planning your career path - I've got your back!

What's on your mind today? 🚀`,

    `👋 **Hello! Great to connect with you!** 

Here's a tech joke to start us off:
What do you call a programmer from Finland?
Nerdic! 😂

Alright, enough fun - let's get to learning! I'm excited to help you with programming concepts, study strategies, career advice, or any technical challenges you're facing.

What would you like to dive into? 💻`,

    `🤖 **Hi there! Ready for some learning adventures?** 

Did you hear about the programmer who was afraid of negative numbers?
He'd stop at nothing to avoid them! 😄

Now that we've broken the ice, I'm all ears! I specialize in making complex programming concepts easy to understand and helping students build practical skills.

What can I help you learn or build today? 🎯`
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}

function generateEnhancedGeneralResponse(message, resources, role, name) {
  const responses = [
    `🤔 **"${message}" - Comprehensive Perspective** 

That's an interesting question! While I specialize in programming and learning, I can offer some valuable insights:

**General Learning Framework:**
📚 **Research**: Explore multiple sources and perspectives
🔍 **Analysis**: Break down the topic into core components  
🛠️ **Application**: Find practical ways to use this knowledge
🔄 **Iteration**: Refine understanding through practice

**Critical Thinking Approach:**
• Question assumptions and seek evidence
• Consider multiple viewpoints and contexts
• Connect new information to existing knowledge
• Apply systematic problem-solving methods

**My Role:**
As your AI tutor, I can help you develop the skills to explore any topic effectively, with a focus on programming and learning methodologies.

${formatEnhancedResources(resources, '🔍 Exploration Resources:')}`,

    `💭 **Addressing "${message}"** 

Thanks for this thoughtful question! Here's my approach to exploring new topics:

**Systematic Learning Strategy:**
1. **Foundation Building**: Understand basic principles first
2. **Progressive Complexity**: Add layers of understanding gradually
3. **Practical Application**: Use knowledge in real scenarios
4. **Continuous Refinement**: Improve through feedback and practice

**Key Learning Principles:**
• Curiosity drives deeper understanding
• Consistency creates lasting knowledge
• Context makes information meaningful
• Community accelerates learning

**How I Can Help:**
I can guide you in developing effective learning strategies and applying them to programming and skill development.

${formatEnhancedResources(resources, '📖 Learning Materials:')}`
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}

function extractMainTopic(message) {
  // Simple topic extraction - can be enhanced
  const words = message.toLowerCase().split(' ');
  const stopWords = ['what', 'how', 'why', 'when', 'where', 'the', 'a', 'an', 'is', 'are', 'do', 'does', 'can'];
  const topic = words.find(word => !stopWords.includes(word) && word.length > 3);
  return topic || 'this topic';
}

function formatEnhancedResources(resources, title) {
  if (!resources || resources.length === 0) {
    return '\n💡 *Tip: Check our resources section for more learning materials!*';
  }

  const resourceList = resources.map(resource => 
    `• **${resource.title}** (${resource.type}) - ${resource.description || 'Comprehensive learning material'}`
  ).join('\n');

  return `\n${title}\n${resourceList}`;
}

function generateEnhancedFallback(message) {
  const fallbacks = [
    `🔧 **Technical Note**\n\nI understand you're asking about "${message}". As an AI programming tutor, I specialize in helping with coding concepts, learning strategies, and career development. I'd be happy to provide guidance on these areas or help you develop the skills to explore other topics effectively.\n\nWhat specific aspect of programming or learning can I assist you with today?`,

    `🎯 **Focus Area**\n\nThanks for your question about "${message}"! My expertise lies in programming education, skill development, and learning methodologies. I can offer valuable insights on technical topics, study strategies, and career growth in the tech industry.\n\nHow can I help you with your programming journey or learning goals?`,

    `💡 **Specialized Support**\n\nI appreciate your question about "${message}"! While I focus primarily on programming and educational guidance, I can help you develop the critical thinking and learning skills needed to explore any topic systematically.\n\nWhat programming concept or learning challenge would you like to tackle together?`
  ];

  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}