
export const VIDEO_SUMMARIES = {
  1: "This tutorial covers CSS fundamentals including selectors, box model, flexbox, and responsive design. Perfect for absolute beginners looking to build their first website.",
  2: "Comprehensive guide to CSS Flexbox covering container properties, item alignment, responsive layouts, and practical examples for modern web design.",
  3: "Intermediate HTML and CSS concepts including semantic HTML, advanced selectors, CSS Grid, transitions, and accessibility best practices.",
  4: "Advanced CSS techniques covering CSS variables, blend modes, clip-path, animations, and performance optimization for professional web development.",
  5: "Complete Java programming tutorial covering syntax, data types, control structures, methods, and object-oriented programming fundamentals.",
  6: "Deep dive into Java OOP concepts including classes, objects, inheritance, polymorphism, encapsulation, and abstraction with practical examples.",
  7: "Comprehensive guide to Java Collections Framework covering Lists, Sets, Maps, and their implementations with performance considerations.",
  8: "Complete tutorial on Java exception handling including try-catch blocks, custom exceptions, and best practices for error management.",
  9: "Modern Java features including lambda expressions, streams, optional class, and functional programming concepts introduced in Java 8.",
  10: "Advanced Java multithreading covering thread creation, synchronization, executors, and concurrent collections for high-performance applications.",
  11: "JavaScript fundamentals including variables, functions, DOM manipulation, events, and ES6+ features for web development beginners.",
  12: "Practical guide to DOM manipulation covering element selection, event handling, dynamic content creation, and modern JavaScript APIs.",
  13: "Comprehensive coverage of ES6+ features including arrow functions, template literals, destructuring, modules, and modern JavaScript syntax.",
  14: "Asynchronous JavaScript concepts including callbacks, promises, async/await, and error handling for modern web applications.",
  15: "Advanced JavaScript concepts covering closures, scope chain, execution context, and functional programming patterns.",
  16: "Deep dive into JavaScript event loop, call stack, task queue, and microtasks for understanding asynchronous behavior.",
  17: "Python programming basics including data types, control flow, functions, and file handling for absolute beginners.",
  18: "Object-oriented programming in Python covering classes, inheritance, polymorphism, and special methods with practical examples.",
  19: "Advanced Python concepts including decorators, generators, context managers, and metaprogramming techniques.",
  20: "SQL fundamentals covering database design, CRUD operations, joins, and basic queries for beginners.",
  21: "Database design principles including normalization, relationships, indexing, and schema optimization techniques.",
  22: "Advanced SQL concepts covering subqueries, CTEs, window functions, and performance optimization strategies.",
  23: "Comprehensive guide to SQL window functions for analytical queries and data analysis tasks.",
  24: "Database performance tuning covering query optimization, indexing strategies, and monitoring tools.",
  25: "Database security best practices including authentication, authorization, encryption, and audit trails."
};

export const LEARNING_OBJECTIVES = {
  1: [
    "CSS selectors, box model & responsive design",
    "Flexbox layouts & modern website building"
  ],
  2: [
    "Flexbox container properties & alignment",
    "Responsive layouts & real-world examples"
  ],
  3: [
    "Semantic HTML & advanced CSS selectors",
    "CSS Grid layouts & animations"
  ],
  4: [
    "CSS variables & advanced visual effects",
    "Performance optimization techniques"
  ],
  5: [
    "Java syntax & data types",
    "Control structures & methods"
  ],
  6: [
    "Classes, objects & inheritance",
    "Polymorphism & OOP principles"
  ],
  7: [
    "Lists, Sets, Maps interfaces",
    "Collection performance & iterators"
  ],
  8: [
    "Exception handling with try-catch",
    "Custom exceptions & best practices"
  ],
  9: [
    "Lambda expressions & Streams API",
    "Optional class & functional programming"
  ],
  10: [
    "Thread creation & synchronization",
    "Executor services & concurrent collections"
  ],
  11: [
    "JavaScript syntax & data types",
    "Functions & DOM manipulation"
  ],
  12: [
    "DOM element selection & modification",
    "Event handling & dynamic content"
  ],
  13: [
    "Arrow functions & template literals",
    "Destructuring & ES6 modules"
  ],
  14: [
    "Promises & async/await syntax",
    "Error handling in async code"
  ],
  15: [
    "Closure concepts & scope chain",
    "Functional programming patterns"
  ],
  16: [
    "Event loop & call stack mechanics",
    "Microtasks vs macrotasks"
  ],
  17: [
    "Python data types & control flow",
    "Functions & file handling"
  ],
  18: [
    "Python classes & inheritance",
    "Special methods & OOP principles"
  ],
  19: [
    "Decorators & generators",
    "Context managers & metaprogramming"
  ],
  20: [
    "SQL SELECT queries & CRUD operations",
    "JOIN operations & data filtering"
  ],
  21: [
    "Database normalization & relationships",
    "Indexing & schema design"
  ],
  22: [
    "Subqueries & window functions",
    "Query optimization techniques"
  ],
  23: [
    "Window function syntax & usage",
    "Analytical queries with partitions"
  ],
  24: [
    "SQL query analysis & optimization",
    "Index creation & performance monitoring"
  ],
  25: [
    "User authentication & authorization",
    "Database encryption & audit trails"
  ]
};

// Map specific resource IDs to summary IDs
export const RESOURCE_TO_SUMMARY_MAP = {
  // HTML and CSS Basics - Key Videos
  1: 1,   // "Learn CSS in 20 min - Build a Website Tutorial"
  5: 2,   // "CSS Flexbox Complete Guide"
  9: 3,   // "Intermediate HTML & CSS Tutorial"
  13: 4,  // "Advanced CSS & HTML Tutorial"
  
  // Java OOP - Key Videos
  42: 5,  // "Java Programming Tutorial for Beginners"
  43: 6,  // "Java OOP Concepts Explained"
  46: 7,  // "Java Collections Framework Tutorial"
  47: 8,  // "Java Exception Handling Tutorial"
  50: 9,  // "Java 8 Features - Lambda, Streams, Optional"
  51: 10, // "Java Collections: List, Set, Map, Stack and Queue explained"
  
  // JavaScript Basics - Key Videos
  66: 11, // "JavaScript Tutorial for Beginners"
  67: 12, // "JavaScript DOM Manipulation"
  70: 13, // "JavaScript ES6+ Features Tutorial"
  71: 14, // "JavaScript Promises and Async/Await"
  74: 15, // "JavaScript Closures and Scope"
  75: 16, // "JavaScript Event Loop Explained"
  
  // Python Programming - Key Videos
  96: 17, // "Python Tutorial for Beginners"
  98: 18, // "Python OOP Tutorial"
  99: 19, // "Python Advanced Concepts"
  
  // Database Fundamentals - Key Videos
  115: 20, // "SQL Tutorial for Beginners"
  117: 21, // "Database Design Tutorial"
  119: 22, // "Intermediate SQL Tutorial"
  120: 23, // "SQL Window Functions Tutorial"
  122: 24, // "Database Performance Tuning"
  123: 25  // "Database Security Best Practices"
};

// Topic-based fallback mapping
export const topicToResourceMap = {
  "HTML and CSS Basics": { range: [1, 4], default: 1 },
  "Java OOP": { range: [5, 10], default: 5 },
  "JavaScript Basics": { range: [11, 16], default: 11 },
  "Python Programming": { range: [17, 19], default: 17 },
  "Database Fundamentals": { range: [20, 25], default: 20 }
};

// Helper function to extract ID from resource name (fallback)
export const extractResourceId = (resourceName) => {
  if (!resourceName) return null;
  const match = resourceName.match(/(\d+)/);
  return match ? parseInt(match[1]) : null;
};

// Main function to get the appropriate summary/objective ID for a resource
export const getResourceId = (resource) => {
  if (!resource) return null;
  
  // 1. Try specific mapping first (for key videos)
  const mappedId = RESOURCE_TO_SUMMARY_MAP[resource.id];
  if (mappedId) {
    return mappedId;
  }
  
  // 2. Try keyword matching for other resources
  const searchText = (resource.name + " " + (resource.description || "")).toLowerCase();
  const keywordMatches = {
    // HTML/CSS
    'css fundamentals': 1,
    'flexbox': 2,
    'intermediate html': 3,
    'intermediate css': 3,
    'advanced css': 4,
    'advanced html': 4,
    
    // Java
    'java programming': 5,
    'java basics': 5,
    'java oop': 6,
    'object-oriented': 6,
    'collections': 7,
    'exception': 8,
    'lambda': 9,
    'streams': 9,
    'multithreading': 10,
    'concurrency': 10,
    
    // JavaScript
    'javascript tutorial': 11,
    'javascript basics': 11,
    'dom manipulation': 12,
    'es6': 13,
    'async': 14,
    'promises': 14,
    'closure': 15,
    'scope': 15,
    'event loop': 16,
    
    // Python
    'python tutorial': 17,
    'python basics': 17,
    'python oop': 18,
    'advanced python': 19,
    
    // Database
    'sql tutorial': 20,
    'sql basics': 20,
    'database design': 21,
    'normalization': 21,
    'intermediate sql': 22,
    'window functions': 23,
    'performance': 24,
    'tuning': 24,
    'security': 25
  };
  
  for (const [keyword, id] of Object.entries(keywordMatches)) {
    if (searchText.includes(keyword)) {
      return id;
    }
  }
  
  // 3. Fallback to topic mapping
  if (resource.title) {
    const topicMap = topicToResourceMap[resource.title];
    if (topicMap) {
      return topicMap.default;
    }
  }
  
  // 4. Final fallback - extract from name
  return extractResourceId(resource.name);
};

// Main functions to get summary and objectives
export const getSummary = (resource) => {
  const resourceId = getResourceId(resource);
  return VIDEO_SUMMARIES[resourceId] || "This resource provides comprehensive learning material on the topic. Perfect for learners at this level.";
};

export const getObjectives = (resource) => {
  const resourceId = getResourceId(resource);
  return LEARNING_OBJECTIVES[resourceId] || ["Core concepts and fundamentals", "Practical examples and applications"];
};

// Default export for convenience
export default {
  VIDEO_SUMMARIES,
  LEARNING_OBJECTIVES,
  getSummary,
  getObjectives,
  getResourceId
};