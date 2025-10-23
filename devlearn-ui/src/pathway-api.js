// src/assets/pages/pathway-api.js - FIXED VERSION
const API_BASE = 'http://localhost:3001/api/pathways'; // Point to your backend server

// Fetch all pathways from backend
export const fetchPathwaysFromBackend = async () => {
  try {
    console.log('🔄 Fetching pathways from:', API_BASE);
    
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(API_BASE, { 
      headers,
      credentials: 'include' // Important for cookies/sessions
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Pathways loaded from API:', data.length, 'pathways');
    return data;
  } catch (error) {
    console.error('❌ Error fetching pathways:', error);
    // Return fallback data
    //return getFallbackPathways();
  }
};

// Fallback data
const getFallbackPathways = () => {
  console.log('📋 Using fallback pathways data');
  return [
    {
      id: 1,
      title: "Full Stack Web Development",
      slug: "web-dev",
      description: "Learn to build modern web applications from frontend to backend",
      icon: "fa-code",
      color: "#3b82f6",
      levels: [
        {
          name: "HTML & CSS Fundamentals",
          slug: "html-css-beginner",
          description: "Master the building blocks of web development",
          resources: [
            {
              title: "HTML Structure",
              description: "Learn about semantic HTML and document structure",
              codeSnippet: `<!DOCTYPE html>
<html>
<head>
    <title>My Page</title>
</head>
<body>
    <header>Welcome</header>
    <main>Content</main>
</body>
</html>`
            }
          ],
          challenges: [
            {
              id: 1,
              title: "Create a Basic HTML Page",
              description: "Create a simple HTML page with proper structure",
              solution: `<!DOCTYPE html>
<html>
<head>
    <title>My First Page</title>
</head>
<body>
    <header>
        <h1>Welcome</h1>
    </header>
    <main>
        <p>Hello World!</p>
    </main>
    <footer>
        <p>&copy; 2024</p>
    </footer>
</body>
</html>`,
              hint: "Make sure to include all required HTML tags"
            }
          ]
        },
        {
          name: "JavaScript Basics",
          slug: "javascript-beginner",
          description: "Learn programming fundamentals with JavaScript",
          resources: [],
          challenges: [
            {
              id: 2,
              title: "Create a Greeting Function",
              description: "Write a function that returns a greeting message",
              solution: `function greet(name) {
    return "Hello, " + name + "!";
}`,
              hint: "Use string concatenation"
            }
          ]
        }
      ]
    },
    {
      id: 2,
      title: "Java Programming",
      slug: "java",
      description: "Master object-oriented programming with Java",
      icon: "fa-java",
      color: "#007396",
      levels: [
        {
          name: "Java Basics",
          slug: "java-beginner",
          description: "Learn Java syntax and basic programming concepts",
          resources: [],
          challenges: [
            {
              id: 3,
              title: "Your First Java Program",
              description: "Create a Java program that prints a welcome message",
              solution: `public class Welcome {
    public static void main(String[] args) {
        System.out.println("Welcome to Java!");
    }
}`,
              hint: "Make sure the class name matches the filename"
            }
          ]
        }
      ]
    },
    {
      id: 3,
      title: "Python for Beginners", 
      slug: "python",
      description: "Learn Python programming from scratch",
      icon: "fa-python",
      color: "#ffcc00",
      levels: [
        {
          name: "Python Fundamentals",
          slug: "python-beginner",
          description: "Master Python syntax and basic concepts",
          resources: [],
          challenges: [
            {
              id: 4,
              title: "Simple Calculator",
              description: "Write a Python program that adds two numbers",
              solution: `num1 = 10
num2 = 5
result = num1 + num2
print("The sum is:", result)`,
              hint: "Use the + operator for addition"
            }
          ]
        }
      ]
    }
  ];
};

// Other API functions with proper error handling
export const fetchPathwayProgressFromBackend = async () => {
  try {
    const response = await fetch(`${API_BASE}/progress`, {
      credentials: 'include'
    });
    return response.ok ? await response.json() : {};
  } catch (error) {
    console.error('Error fetching progress:', error);
    return {};
  }
};

export const fetchDashboardProgress = async () => {
  try {
    const response = await fetch(`${API_BASE}/dashboard-progress`, {
      credentials: 'include'
    });
    
    if (!response.ok) {
      return getFallbackDashboardProgress();
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching dashboard progress:', error);
    return getFallbackDashboardProgress();
  }
};

const getFallbackDashboardProgress = () => ({
  overallProgress: 25,
  levelProgress: 30,
  challengeProgress: 20,
  stats: {
    completedLevels: 1,
    totalLevels: 4,
    completedChallenges: 3,
    totalChallenges: 12
  }
});

export const saveProgressToBackend = async (pathwaySlug, levelSlug, progressData) => {
  try {
    const response = await fetch(`${API_BASE}/progress`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        pathwaySlug,
        levelSlug,
        progressData
      })
    });
    
    if (!response.ok) throw new Error('Failed to save progress');
    return await response.json();
  } catch (error) {
    console.error('Error saving progress:', error);
    // Save to localStorage as fallback
    const key = `progress-${pathwaySlug}-${levelSlug}`;
    localStorage.setItem(key, JSON.stringify(progressData));
    return { ok: true, message: "Progress saved locally" };
  }
};

export const fetchPathwayComments = async (pathwayId) => {
  try {
    const response = await fetch(`${API_BASE}/${pathwayId}/comments`, {
      credentials: 'include'
    });
    return response.ok ? await response.json() : [];
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
};

export const addPathwayCommentToBackend = async (pathwayId, commentText) => {
  try {
    const response = await fetch(`${API_BASE}/${pathwayId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ text: commentText })
    });
    
    if (!response.ok) throw new Error('Failed to add comment');
    return await response.json();
  } catch (error) {
    console.error('Error adding comment:', error);
    // Return mock response
    return {
      comment_id: Date.now(),
      user_name: "You",
      comment_text: commentText,
      created_at: new Date().toISOString()
    };
  }
};