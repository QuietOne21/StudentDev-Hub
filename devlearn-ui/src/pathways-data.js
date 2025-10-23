// pathways-data.js
export const pathways = [
  // Java
  {
    id: 1,
    title: "Java",
    icon: "fa-java",
    description:"Java is a popular programming language used to build apps, games, and software for computers and mobile devices. It focuses on writing code that works on many types of devices. Learning Java will teach you how to create programs that follow rules called object-oriented programming, which helps organize code into reusable pieces.",
    color: "#00c9ff",
    slug: "java-dsa",
    levels: [
      {
        name: "Beginner",
        slug: "beginner",
        description:
          "Build your foundation. Understand basic Java syntax.",
        resources: [
          {
            title: "Java Syntax and Basics",
            description: "Write and run your first Java program.",
            codeSnippet:
`public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, world!");
    }
}`
          },
          {
            title: "Variables and Data Types",
            description: "Store numbers and text using Java types.",
            codeSnippet:
`int age = 20;
String name = "Junior";
double price = 19.99;`
          },
          {
            title: "Conditionals and Loops",
            description: "Use if/else and for loops for control flow.",
            codeSnippet:
`int score = 75;
if (score >= 50) {
    System.out.println("You passed!");
}`
          },
          {
            title: "Introduction to Arrays",
            description: "Store several values in an array and access them.",
            codeSnippet:
`int[] numbers = {1, 2, 3};
System.out.println(numbers[0]); // prints 1`
          },
          {
            title: "ArrayList Fundamentals",
            description: "Use ArrayList from java.util for dynamic lists.",
            codeSnippet:
`import java.util.ArrayList;
ArrayList<String> list = new ArrayList<>();
list.add("apple");`
          }
        ],
        challenges: [
          {
            id: "java-b-1",
            title: "Hello World (one-line)",
            description: "Print Hello, world! inside main using System.out.println",
            solution: `System.out.println("Hello, world!");`
          },
          {
            id: "java-b-2",
            title: "Variable Output (one-line)",
            description: "Print the name and age like: Junior is 20 years old.",
            solution: `System.out.println(name + " is " + age + " years old.");`
          },
          {
            id: "java-b-3",
            title: "Simple If (one-line)",
            description: "Inside main, print \"You passed!\" when score >= 50.",
            solution: `if (score >= 50) System.out.println("You passed!");`
          },
          {
            id: "java-b-4",
            title: "For Loop Print (one-line)",
            description: "One line that prints Count: 1 (example inside loop).",
            solution: `System.out.println("Count: " + i);`
          },
          {
            id: "java-b-5",
            title: "Array Access (one-line)",
            description: "Print the second element of int[] nums = {10,20};",
            solution: `System.out.println(nums[1]);`
          }
        ]
      },
      {
        name: "Intermediate",
        slug: "intermediate",
        description:"Learn Data Structures and Algorithms",
        resources: [
          {
            title: "Linked List Basics",
            description: "Understand how nodes link together and how to traverse them.",
            codeSnippet:
      `class Node {
          int data;
          Node next;
          Node(int data) { this.data = data; }
      }
      Node head = new Node(1);
      head.next = new Node(2);`
          },
          {
            title: "Stack Implementation",
            description: "Use Java’s Stack class to work with LIFO (last-in, first-out).",
            codeSnippet:
      `import java.util.Stack;
      Stack<Integer> stack = new Stack<>();
      stack.push(10);
      stack.push(20);
      System.out.println(stack.pop()); // 20`
          },
          {
            title: "Queue Implementation",
            description: "Understand FIFO (first-in, first-out) using Java’s Queue.",
            codeSnippet:
      `import java.util.LinkedList;
      import java.util.Queue;
      Queue<String> q = new LinkedList<>();
      q.add("A");
      q.add("B");
      System.out.println(q.poll()); // A`
          },
          {
            title: "Searching Algorithms",
            description: "Learn linear search and binary search on arrays.",
            codeSnippet:
      `int[] nums = {2, 4, 6, 8};
      int target = 6;
      for (int n : nums) if (n == target) System.out.println("Found!");`
          },
          {
            title: "Sorting Algorithms",
            description: "Explore basic sorting like Bubble Sort and Insertion Sort.",
            codeSnippet:
      `int[] arr = {5, 3, 8};
      for (int i = 0; i < arr.length-1; i++)
        for (int j = 0; j < arr.length-i-1; j++)
          if (arr[j] > arr[j+1]) {
            int temp = arr[j];
            arr[j] = arr[j+1];
            arr[j+1] = temp;
          }`
          },
          {
            title: "Introduction to Recursion",
            description: "Learn how methods can call themselves to solve problems.",
            codeSnippet:
      `int factorial(int n) {
          if (n == 0) return 1;
          return n * factorial(n - 1);
      }`
          }
        ],
        challenges: [
          {
            id: "java-i-1",
            title: "Linked List Node",
            description: "Create a linked list of three nodes manually.",
            solution: `Node head = new Node(1); head.next = new Node(2); head.next.next = new Node(3);`
          },
          {
            id: "java-i-2",
            title: "Stack Push/Pop",
            description: "Push two integers and pop one to show LIFO.",
            solution: `stack.push(5); stack.push(10); System.out.println(stack.pop());`
          },
          {
            id: "java-i-3",
            title: "Queue Add/Remove",
            description: "Add three strings and remove one to show FIFO.",
            solution: `q.add("X"); q.add("Y"); q.add("Z"); System.out.println(q.poll());`
          },
          {
            id: "java-i-4",
            title: "Linear Search",
            description: "Write a loop that finds 42 in an array.",
            solution: `for(int n: arr) if(n==42) System.out.println("Found!");`
          },
          {
            id: "java-i-5",
            title: "Binary Search",
            description: "Use Arrays.binarySearch on a sorted array.",
            solution: `int idx = Arrays.binarySearch(arr, 8);`
          },
          {
            id: "java-i-6",
            title: "Bubble Sort Swap",
            description: "Show the swap step in bubble sort.",
            solution: `if(arr[j] > arr[j+1]) { int tmp=arr[j]; arr[j]=arr[j+1]; arr[j+1]=tmp; }`
          }
        ]
      },
      {
        name: "Expert",
        slug: "expert",
        description:
          "Trees, Graphs and Dynamic programming",
        resources: [
          {
            title: "Introduction to Trees",
            description: "A tree is a hierarchical structure where nodes have children, starting from a root. Trees represent file systems, HTML, and more.",
            codeSnippet: `class TreeNode {
          int value;
          TreeNode left, right;
          TreeNode(int val) { value = val; }
      }`
          },
          {
            title: "Binary Search Trees (BSTs)",
            description: "A BST keeps smaller values on the left and larger ones on the right, allowing efficient search and insertion.",
            codeSnippet: `TreeNode insert(TreeNode root, int val) {
          if (root == null) return new TreeNode(val);
          if (val < root.value) root.left = insert(root.left, val);
          else root.right = insert(root.right, val);
          return root;
      }`
          },
          {
            title: "Tree Traversals (Inorder, Preorder, Postorder)",
            description: "Learn ways to walk through a tree: Inorder (LNR), Preorder (NLR), Postorder (LRN).",
            codeSnippet: `void inorder(TreeNode root) {
          if (root != null) {
              inorder(root.left);
              System.out.print(root.value + " ");
              inorder(root.right);
          }
      }`
          },
          {
            title: "Graphs – Networks of Data",
            description: "Graphs model connections like social networks or maps. Made of vertices (nodes) and edges (links).",
            codeSnippet: `Map<String, List<String>> graph = new HashMap<>();
      graph.put("A", Arrays.asList("B","C"));
      graph.put("B", Arrays.asList("A","D"));`
          },
          {
            title: "Graph Traversals – DFS & BFS",
            description: "DFS explores deeply, BFS explores level by level. Critical for pathfinding and AI.",
            codeSnippet: `Queue<String> q = new LinkedList<>();
      Set<String> visited = new HashSet<>();
      q.add("A"); visited.add("A");
      while(!q.isEmpty()){
          String node = q.remove();
          for(String n: graph.get(node))
              if(!visited.contains(n)){visited.add(n); q.add(n);}
      }`
          },
          {
            title: "Shortest Path Algorithms",
            description: "Learn Dijkstra’s and Bellman-Ford for weighted graphs, and BFS for unweighted graphs.",
            codeSnippet: `// Pseudocode: Dijkstra uses priority queue to update shortest distances`
          },
          {
            title: "Dynamic Programming (DP)",
            description: "DP solves big problems by storing solutions to overlapping subproblems.",
            codeSnippet: `int[] memo = new int[50];
      int fib(int n){
          if(n<=1) return n;
          if(memo[n]!=0) return memo[n];
          return memo[n]=fib(n-1)+fib(n-2);
      }`
          },
          {
            title: "Knapsack Problem",
            description: "Classic optimization: maximize value while staying within weight capacity.",
            codeSnippet: `int knapsack(int[] wt, int[] val, int W, int n){
          int[][] dp=new int[n+1][W+1];
          for(int i=1;i<=n;i++){
              for(int w=1;w<=W;w++){
                  if(wt[i-1]<=w)
                      dp[i][w]=Math.max(val[i-1]+dp[i-1][w-wt[i-1]],dp[i-1][w]);
                  else dp[i][w]=dp[i-1][w];
              }
          }
          return dp[n][W];
      }`
          },
          {
            title: "Longest Common Subsequence (LCS)",
            description: "Find the longest sequence common to two strings—used in diff tools and bioinformatics.",
            codeSnippet: `int LCS(String a, String b){
          int[][] dp=new int[a.length()+1][b.length()+1];
          for(int i=1;i<=a.length();i++)
            for(int j=1;j<=b.length();j++)
              if(a.charAt(i-1)==b.charAt(j-1))
                  dp[i][j]=1+dp[i-1][j-1];
              else dp[i][j]=Math.max(dp[i-1][j],dp[i][j-1]);
          return dp[a.length()][b.length()];
      }`
          },
          {
            title: "Topological Sorting",
            description: "Order tasks that depend on each other, useful in scheduling and dependency resolution.",
            codeSnippet: `// DFS-based Topological Sort
      void topoSortUtil(int v, boolean[] visited, Stack<Integer> stack){
          visited[v]=true;
          for(int n: adj[v]) if(!visited[n]) topoSortUtil(n,visited,stack);
          stack.push(v);
      }`
          }
        ],
        challenges: [
          {
            id: "java-e-1",
            title: "Max Depth of Tree",
            description: "Write a method that calculates the maximum depth of a binary tree.",
            solution: `int maxDepth(TreeNode root){
          if(root==null) return 0;
          return 1+Math.max(maxDepth(root.left),maxDepth(root.right));
      }`
          },
          {
            id: "java-e-2",
            title: "BST Search",
            description: "Return true if a value exists in a BST.",
            solution: `boolean searchBST(TreeNode root,int val){
          if(root==null) return false;
          if(root.value==val) return true;
          return val<root.value ? searchBST(root.left,val):searchBST(root.right,val);
      }`
          },
          {
            id: "java-e-3",
            title: "Tree Traversals",
            description: "Print values of a tree using inorder traversal.",
            solution: `void inorder(TreeNode root){ if(root!=null){ inorder(root.left); System.out.print(root.value+" "); inorder(root.right); } }`
          },
          {
            id: "java-e-4",
            title: "Graph BFS",
            description: "Write BFS that prints all nodes starting from A.",
            solution: `// BFS loop from resources`
          },
          {
            id: "java-e-5",
            title: "Graph DFS",
            description: "Implement DFS recursion for graph traversal.",
            solution: `void dfs(String node, Set<String> visited){
          visited.add(node);
          for(String n: graph.get(node))
              if(!visited.contains(n)) dfs(n,visited);
      }`
          },
          {
            id: "java-e-6",
            title: "Shortest Path BFS",
            description: "Find the shortest path in an unweighted graph using BFS.",
            solution: `// Track parents while BFS runs, reconstruct path at the end`
          },
          {
            id: "java-e-7",
            title: "DP Fibonacci",
            description: "Implement Fibonacci using tabulation.",
            solution: `int fibDP(int n){
          int[] dp=new int[n+1];
          dp[0]=0; dp[1]=1;
          for(int i=2;i<=n;i++) dp[i]=dp[i-1]+dp[i-2];
          return dp[n];
      }`
          },
          {
            id: "java-e-8",
            title: "0/1 Knapsack",
            description: "Solve knapsack with n=3, W=50, weights=[10,20,30], values=[60,100,120].",
            solution: `// Use knapsack() from resources with these inputs`
          },
          {
            id: "java-e-9",
            title: "LCS of 'abc' and 'ac'",
            description: "Use DP to compute longest common subsequence.",
            solution: `System.out.println(LCS("abc","ac")); // Output: 2`
          },
          {
            id: "java-e-10",
            title: "Topological Sort Order",
            description: "Print topological ordering for a DAG with 6 nodes.",
            solution: `// Use topoSortUtil and stack from resources`
          }
        ]
      }
      
      
    ]
  },

  // HTML
  {
    id: 2,
    title: "HTML",
    icon: "fa-html5",
    description:
      "HTML is the language used to create the structure of web pages. Think of it as the skeleton of a website — it tells the browser where headings, paragraphs, images, and links should appear. Learning HTML helps you build the basic foundation of a website.",
    color: "#ff6b6b",
    slug: "html-fundamentals",
    levels: [
      {
        name: "Beginner",
        slug: "beginner",
        description: "Learn basic HTML tags, structure, and elements",
        resources: [
          {
            title: "Basic Elements",
            description: "Headings, paragraphs and simple tags.",
            codeSnippet:
`<h1>Welcome</h1>
<p>This is a paragraph.</p>`
          },
          {
            title: "Links & Images",
            description: "Anchors and images.",
            codeSnippet:
`<a href="https://example.com">Visit</a>
<img src="image.jpg" alt="My image">`
          },
          {
            title: "Lists",
            description: "Create ordered/unordered lists.",
            codeSnippet:
`<ul>
  <li>Item 1</li>
</ul>`
          },
          {
            title: "Headings & Paragraphs",
            description: "Structure content with headings and paragraphs.",
            codeSnippet:
`<h2>Section</h2>
<p>Text here</p>`
          },
          {
            title: "Forms Intro",
            description: "Simple input and submit button.",
            codeSnippet:
`<form><input name="name" /><button type="submit">Send</button></form>`
          }
        ],
        challenges: [
          {
            id: "html-b-1",
            title: "Add Heading",
            description: "Write an h1 element with text 'My Heading'.",
            solution: `<h1>My Heading</h1>`
          },
          {
            id: "html-b-2",
            title: "Anchor Link",
            description: "Write an anchor linking to https://example.com with text Example",
            solution: `<a href="https://example.com">Example</a>`
          },
          {
            id: "html-b-3",
            title: "Image Tag",
            description: "Image tag with src 'pic.jpg' and alt 'pic'.",
            solution: `<img src="pic.jpg" alt="pic">`
          },
          {
            id: "html-b-4",
            title: "Unordered List",
            description: "ul with two items One and Two.",
            solution: `<ul><li>One</li><li>Two</li></ul>`
          },
          {
            id: "html-b-5",
            title: "Simple Form",
            description: "Form with input named 'email' and a submit button.",
            solution: `<form><input type="text" name="email"><button type="submit">Submit</button></form>`
          }
        ]
      },
      {
        name: "Intermediate",
        slug: "intermediate",
        description: "Semantic HTML and accessibility.",
        resources: [
          {
            title: "Semantic HTML Basics",
            description: "Learn how to replace generic <div> tags with semantic elements that improve readability and SEO.",
            codeSnippet: `<!-- Instead of this -->
      <div id="header">Welcome</div>
      
      <!-- Use semantic HTML -->
      <header>Welcome</header>`
          },
          {
            title: "Grouping Content with <section> and <article>",
            description: "Use <section> for grouping related content and <article> for self-contained pieces like blog posts.",
            codeSnippet: `<section>
        <h2>Latest News</h2>
        <article>
          <h3>Campus Update</h3>
          <p>Our new library wing opens next month.</p>
        </article>
      </section>`
          },
          {
            title: "Accessibility with Alt Text",
            description: "Always provide descriptive alt attributes for images so screen readers can describe them to users.",
            codeSnippet: `<img src="campus.jpg" alt="A wide view of the university campus with the new library building">`
          },
          {
            title: "Forms with Labels",
            description: "Use <label> with form controls so screen readers can associate inputs with their purpose.",
            codeSnippet: `<form>
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" required>
      </form>`
          },
          {
            title: "Navigation with <nav>",
            description: "Mark up menus and navigation bars using <nav> so assistive technologies recognize them.",
            codeSnippet: `<nav>
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>`
          },
          {
            title: "Headings and Landmarks",
            description: "Use headings (<h1>–<h6>) logically to give structure to your page. This helps both SEO and accessibility.",
            codeSnippet: `<main>
        <h1>University News</h1>
        <h2>Campus Expansion</h2>
        <p>Details about the new wing...</p>
      </main>`
          }
        ],
        challenges: [
          {
            title: "Challenge 1: Blog Page",
            description: "Create a simple blog page with <header>, <main>, <article>, and <footer>. Each article should have a title and a paragraph.",
            solution: `<header><h1>My Blog</h1></header>
      <main>
        <article>
          <h2>First Post</h2>
          <p>This is my first blog entry.</p>
        </article>
        <article>
          <h2>Second Post</h2>
          <p>Another blog entry with more content.</p>
        </article>
      </main>
      <footer>&copy; 2025 My Blog</footer>`
          },
          {
            title: "Challenge 2: Accessible Form",
            description: "Build a contact form that includes proper labels, placeholders, and accessible input types (like email and tel).",
            solution: `<form>
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" placeholder="Enter your name" required>
      
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" placeholder="you@example.com" required>
      
        <label for="phone">Phone:</label>
        <input type="tel" id="phone" name="phone" placeholder="123-456-7890">
      
        <button type="submit">Send</button>
      </form>`
          },
          {
            title: "Challenge 3: Image Accessibility",
            description: "Add two images: one with descriptive alt text and one marked as decorative (no alt needed).",
            solution: `<img src="campus.jpg" alt="Students walking across the campus courtyard">
      <img src="decorative-line.png" alt="">`
          },
          {
            title: "Challenge 4: Navigation Menu",
            description: "Create a navigation bar using <nav> with three links: Home, About, and Contact.",
            solution: `<nav>
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>`
          }
        ]
      },
      {
        name: "Expert",
        slug: "expert",
        description: "APIs, web components, and advanced HTML.",
        resources: [
          {
            title: "Custom Data Attributes",
            description: "Use data-* attributes to store extra information directly on HTML elements. These can be accessed later with JavaScript for dynamic behavior.",
            codeSnippet: `<button data-user-id="42">View Profile</button>`
          },
          {
            title: "HTML5 APIs Overview",
            description: "Explore built-in APIs like Geolocation, Local Storage, and Drag & Drop, which allow web pages to interact with users in powerful ways.",
            codeSnippet: `if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
          console.log(pos.coords.latitude, pos.coords.longitude);
        });
      }`
          },
          {
            title: "Forms with Validation Attributes",
            description: "Leverage HTML5 form attributes like required, pattern, and min/max to enforce rules without JavaScript.",
            codeSnippet: `<form>
        <input type="email" required>
        <input type="number" min="18" max="99">
      </form>`
          },
          {
            title: "Media Elements & Controls",
            description: "Use <audio> and <video> with custom attributes like autoplay, controls, and loop to enrich your web pages.",
            codeSnippet: `<video controls autoplay>
        <source src="lecture.mp4" type="video/mp4">
      </video>`
          },
          {
            title: "Canvas API Basics",
            description: "The <canvas> element lets you draw shapes, charts, or even games directly in HTML with JavaScript.",
            codeSnippet: `<canvas id="myCanvas" width="200" height="100"></canvas>`
          },
          {
            title: "Web Storage (localStorage & sessionStorage)",
            description: "Save small amounts of data directly in the browser. localStorage persists until cleared, sessionStorage clears when the tab closes.",
            codeSnippet: `localStorage.setItem("username", "Junior");
      console.log(localStorage.getItem("username"));`
          },
          {
            title: "Accessible Rich Internet Applications (ARIA)",
            description: "ARIA roles and attributes help make complex elements accessible to screen readers.",
            codeSnippet: `<button aria-label="Close">X</button>`
          },
          {
            title: "IFrames and Embedding",
            description: "Embed external websites, videos, or interactive apps using <iframe>. Use responsibly, since they affect performance and security.",
            codeSnippet: `<iframe src="https://www.example.com" title="Embedded Example"></iframe>`
          },
          {
            title: "Web Components – Shadow DOM",
            description: "Web components let you create reusable custom elements with encapsulated HTML, CSS, and JS using the Shadow DOM.",
            codeSnippet: `<my-button></my-button>`
          },
          {
            title: "Progressive Enhancement & Best Practices",
            description: "Learn how to design pages that work on basic browsers, then enhance them with advanced features.",
            codeSnippet: `<!-- Start simple, enhance with JS later -->
      <button id="subscribe">Subscribe</button>`
          }
        ],
        challenges: [
          {
            title: "Challenge 1: Data Attribute",
            description: "Create a button with a data attribute for product-id set to 123. Print it in the console with JavaScript.",
            solution: `<button data-product-id="123">Buy</button>
      <script>
        console.log(document.querySelector("button").dataset.productId);
      </script>`
          },
          {
            title: "Challenge 2: Geolocation",
            description: "Use the Geolocation API to print latitude and longitude to the console.",
            solution: `<script>
      navigator.geolocation.getCurrentPosition(pos => {
        console.log(pos.coords.latitude, pos.coords.longitude);
      });
      </script>`
          },
          {
            title: "Challenge 3: Form Validation",
            description: "Build a form with an email input that requires a proper email and a number input that only allows ages 18–65.",
            solution: `<form>
        <input type="email" required>
        <input type="number" min="18" max="65">
        <button type="submit">Submit</button>
      </form>`
          },
          {
            title: "Challenge 4: Video Player",
            description: "Embed a video with controls, autoplay, and a fallback message if the browser doesn’t support it.",
            solution: `<video controls autoplay>
        <source src="video.mp4" type="video/mp4">
        Your browser does not support the video tag.
      </video>`
          },
          {
            title: "Challenge 5: Canvas Drawing",
            description: "Add a canvas and draw a rectangle using JavaScript.",
            solution: `<canvas id="c" width="200" height="100"></canvas>
      <script>
        const ctx = document.getElementById("c").getContext("2d");
        ctx.fillStyle = "blue";
        ctx.fillRect(20, 20, 150, 75);
      </script>`
          },
          {
            title: "Challenge 6: Local Storage",
            description: "Store the username 'Junior' in localStorage and display it in an alert.",
            solution: `<script>
      localStorage.setItem("username", "Junior");
      alert(localStorage.getItem("username"));
      </script>`
          },
          {
            title: "Challenge 7: ARIA",
            description: "Make a close button accessible with aria-label='Close'.",
            solution: `<button aria-label="Close">X</button>`
          },
          {
            title: "Challenge 8: IFrame Embed",
            description: "Embed a YouTube video using an <iframe> with title='Demo Video'.",
            solution: `<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="Demo Video"></iframe>`
          },
          {
            title: "Challenge 9: Custom Element",
            description: "Define a custom element <my-button> that displays a styled button with Shadow DOM.",
            solution: `<script>
      class MyButton extends HTMLElement {
        constructor() {
          super();
          this.attachShadow({ mode: "open" });
          this.shadowRoot.innerHTML = "<button>Click Me</button>";
        }
      }
      customElements.define("my-button", MyButton);
      </script>
      <my-button></my-button>`
          },
          {
            title: "Challenge 10: Progressive Enhancement",
            description: "Create a button that works without JS, but if JS is available, adds a click alert.",
            solution: `<button id="enhance">Click Me</button>
      <script>
        document.getElementById("enhance").addEventListener("click", () => {
          alert("Enhanced with JS!");
        });
      </script>`
          }
        ]
      }
    ]
  },

  // CSS
  // CSS Pathway
{
  id: 3,
  title: "CSS",
  icon: "fa-css3-alt",
  description: "CSS is used to make websites look nice. It controls colors, fonts, layouts, and spacing. If HTML is the skeleton, CSS is the skin, clothes, and style — it makes the website visually appealing.",
  color: "#92fe9d",
  slug: "css",
  levels: [
    {
      name: "Beginner",
      slug: "beginner",
      description: "Learn basic CSS selectors, properties, and values to style web pages.",
      resources: [
        {
          title: "CSS Selectors and Basic Styling",
          description: "Learn how to target HTML elements and apply colors, fonts, and spacing.",
          codeSnippet: `/* Target elements by tag name */
p {
  color: blue;
  font-size: 16px;
}

/* Target by class */
.highlight {
  background-color: yellow;
}

/* Target by ID */
#header {
  text-align: center;
}`
        },
        {
          title: "Box Model Fundamentals",
          description: "Understand content, padding, border, and margin - the core of CSS layout.",
          codeSnippet: `.box {
  width: 200px;
  height: 100px;
  padding: 20px;
  border: 2px solid black;
  margin: 10px;
  background-color: lightblue;
}`
        },
        {
          title: "Typography and Text Styling",
          description: "Control fonts, sizes, spacing, and text decoration for beautiful typography.",
          codeSnippet: `body {
  font-family: Arial, sans-serif;
  font-size: 16px;
  line-height: 1.5;
  color: #333;
}

h1 {
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  text-decoration: underline;
}

p {
  text-indent: 20px;
  letter-spacing: 1px;
}`
        },
        {
          title: "Colors and Backgrounds",
          description: "Use different color formats and apply background images and gradients.",
          codeSnippet: `/* Color formats */
.color-example {
  color: red;                    /* Named color */
  color: #ff0000;               /* Hex color */
  color: rgb(255, 0, 0);        /* RGB */
  color: rgba(255, 0, 0, 0.5);  /* RGB with alpha */
}

/* Backgrounds */
.background-example {
  background-color: #f0f0f0;
  background-image: url('pattern.png');
  background-size: cover;
  background-position: center;
}

/* Gradient background */
.gradient-box {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
}`
        },
        {
          title: "Basic Layout with Display",
          description: "Use display properties to control element layout and positioning.",
          codeSnippet: `/* Block elements (default for div, p, h1-h6) */
.block-element {
  display: block;
  width: 100%;
}

/* Inline elements (default for span, a, strong) */
.inline-element {
  display: inline;
  margin: 0 10px;
}

/* Inline-block - hybrid */
.inline-block-element {
  display: inline-block;
  width: 100px;
  height: 100px;
}

/* Hide elements */
.hidden-element {
  display: none;
}`
        }
      ],
      challenges: [
        {
          id: "css-b-1",
          title: "Style Headings",
          description: "Make all h1 elements red with font size 32px and center aligned.",
          hint: "Use color, font-size, and text-align properties.",
          solution: `h1 {
  color: red;
  font-size: 32px;
  text-align: center;
}`
        },
        {
          id: "css-b-2",
          title: "Create a Box with Padding",
          description: "Create a div with class 'card' that has 20px padding and a light gray background.",
          hint: "Use padding and background-color properties.",
          solution: `.card {
  padding: 20px;
  background-color: lightgray;
}`
        },
        {
          id: "css-b-3",
          title: "Text Styling",
          description: "Make paragraphs have 1.6 line height and dark gray color (#333).",
          hint: "Use line-height and color properties.",
          solution: `p {
  line-height: 1.6;
  color: #333;
}`
        },
        {
          id: "css-b-4",
          title: "Gradient Background",
          description: "Create a div with a linear gradient from #667eea to #764ba2.",
          hint: "Use background with linear-gradient() function.",
          solution: `.gradient-div {
  background: linear-gradient(to right, #667eea, #764ba2);
}`
        },
        {
          id: "css-b-5",
          title: "Inline Block Layout",
          description: "Create three divs with class 'box' that display inline-block with 100px width and margin.",
          hint: "Use display: inline-block and set width and margin.",
          solution: `.box {
  display: inline-block;
  width: 100px;
  margin: 10px;
}`
        }
      ]
    },
    {
      name: "Intermediate",
      slug: "intermediate",
      description: "Master Flexbox, Grid, and responsive design for modern web layouts.",
      resources: [
        {
          title: "Flexbox Fundamentals",
          description: "Use Flexbox for one-dimensional layouts with powerful alignment capabilities.",
          codeSnippet: `.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.item {
  flex: 1;
  padding: 10px;
}

/* Flexbox centering */
.center-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}`
        },
        {
          title: "CSS Grid Basics",
          description: "Create two-dimensional layouts with CSS Grid for complex page structures.",
          codeSnippet: `.grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 100px auto;
  gap: 20px;
}

.grid-item {
  background: #f0f0f0;
  padding: 20px;
}

/* Grid areas for semantic layout */
.layout {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: 200px 1fr;
}`
        },
        {
          title: "Responsive Design with Media Queries",
          description: "Make your designs adapt to different screen sizes using media queries.",
          codeSnippet: `/* Mobile first approach */
.container {
  padding: 10px;
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    padding: 20px;
    max-width: 720px;
    margin: 0 auto;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    max-width: 1200px;
    padding: 40px;
  }
}

/* Hide on mobile */
.mobile-hidden {
  display: none;
}

@media (min-width: 768px) {
  .mobile-hidden {
    display: block;
  }
}`
        },
        {
          title: "CSS Variables (Custom Properties)",
          description: "Use CSS variables for consistent theming and easy maintenance.",
          codeSnippet: `:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --font-size-base: 16px;
  --spacing-unit: 8px;
  --border-radius: 4px;
}

.button {
  background-color: var(--primary-color);
  color: white;
  padding: calc(var(--spacing-unit) * 2);
  border-radius: var(--border-radius);
  font-size: var(--font-size-base);
}

.card {
  padding: calc(var(--spacing-unit) * 3);
  border: 1px solid var(--secondary-color);
  border-radius: var(--border-radius);
}`
        },
        {
          title: "Transitions and Transformations",
          description: "Add smooth animations and visual transformations to elements.",
          codeSnippet: `/* Smooth transitions */
.button {
  background: blue;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.button:hover {
  background: darkblue;
  transform: translateY(-2px);
}

/* Transformations */
.transform-example {
  transform: rotate(45deg) scale(1.1);
  transition: transform 0.3s ease;
}

/* Keyframe animations */
@keyframes slideIn {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animated-element {
  animation: slideIn 0.5s ease-out;
}`
        }
      ],
      challenges: [
        {
          id: "css-i-1",
          title: "Flexbox Navigation",
          description: "Create a navigation bar with items spaced evenly using Flexbox.",
          hint: "Use display: flex and justify-content: space-between.",
          solution: `.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
}`
        },
        {
          id: "css-i-2",
          title: "CSS Grid Layout",
          description: "Create a 3-column grid with 20px gap between items.",
          hint: "Use display: grid, grid-template-columns, and gap properties.",
          solution: `.grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
}`
        },
        {
          id: "css-i-3",
          title: "Responsive Media Query",
          description: "Make a 3-column grid become 1 column on screens smaller than 768px.",
          hint: "Use a media query with max-width: 768px.",
          solution: `@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
}`
        },
        {
          id: "css-i-4",
          title: "CSS Variables",
          description: "Create CSS variables for primary color (#007bff) and spacing (16px).",
          hint: "Define variables in :root and use them with var().",
          solution: `:root {
  --primary-color: #007bff;
  --spacing: 16px;
}

.element {
  color: var(--primary-color);
  padding: var(--spacing);
}`
        },
        {
          id: "css-i-5",
          title: "Hover Transition",
          description: "Make a button smoothly change background color on hover over 0.3 seconds.",
          hint: "Use transition property and :hover pseudo-class.",
          solution: `.button {
  background: blue;
  transition: background-color 0.3s ease;
}

.button:hover {
  background: darkblue;
}`
        }
      ]
    },
    {
      name: "Expert",
      slug: "expert",
      description: "Master advanced CSS techniques including animations, architecture, and performance optimization.",
      resources: [
        {
          title: "Advanced CSS Animations",
          description: "Create complex animations with keyframes, timing functions, and multiple properties.",
          codeSnippet: `@keyframes bounce {
  0%, 20%, 53%, 80%, 100% {
    transform: translate3d(0, 0, 0);
  }
  40%, 43% {
    transform: translate3d(0, -30px, 0);
  }
  70% {
    transform: translate3d(0, -15px, 0);
  }
  90% {
    transform: translate3d(0, -4px, 0);
  }
}

.bounce-animation {
  animation: bounce 1s ease infinite;
}

/* Complex multi-step animation */
@keyframes complexAnimation {
  0% {
    transform: translateX(0) rotate(0deg);
    opacity: 1;
  }
  50% {
    transform: translateX(100px) rotate(180deg);
    opacity: 0.5;
  }
  100% {
    transform: translateX(0) rotate(360deg);
    opacity: 1;
  }
}`
        },
        {
          title: "CSS Architecture - BEM Methodology",
          description: "Organize CSS with Block-Element-Modifier methodology for maintainable code.",
          codeSnippet: `/* Block */
.card { }

/* Element */
.card__title { }
.card__body { }
.card__footer { }

/* Modifier */
.card--featured { }
.card--dark { }

/* Example usage */
<div class="card card--featured">
  <h2 class="card__title">Featured Title</h2>
  <div class="card__body">Content here</div>
  <div class="card__footer">Footer content</div>
</div>`
        },
        {
          title: "Advanced Grid Techniques",
          description: "Use auto-fit, minmax, and grid template areas for responsive layouts.",
          codeSnippet: `.responsive-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

/* Complex grid layout */
.dashboard {
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: 80px 1fr 60px;
  grid-template-areas:
    "sidebar header"
    "sidebar main"
    "sidebar footer";
  height: 100vh;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }`
        },
        {
          title: "CSS Custom Properties for Theming",
          description: "Create dynamic themes using CSS variables and JavaScript.",
          codeSnippet: `:root {
  --bg-primary: #ffffff;
  --text-primary: #333333;
  --accent-color: #007bff;
}

[data-theme="dark"] {
  --bg-primary: #1a1a1a;
  --text-primary: #ffffff;
  --accent-color: #4dabf7;
}

body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition: all 0.3s ease;
}

.button {
  background: var(--accent-color);
  color: white;
}

/* JavaScript theme switching */
// document.documentElement.setAttribute('data-theme', 'dark');`
        },
        {
          title: "Performance Optimization",
          description: "Optimize CSS for performance with efficient selectors and critical CSS.",
          codeSnippet: `/* Efficient selectors */
/* Good - specific and fast */
.nav-item { }

/* Bad - too generic */
div ul li a { }

/* Critical CSS - above the fold */
.critical {
  /* Styles needed for initial render */
}

/* Lazy load non-critical CSS */
<link rel="preload" href="styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">

/* CSS containment for performance */
.isolated-component {
  contain: layout style paint;
}`

        }
      ],
      challenges: [
        {
          id: "css-e-1",
          title: "Bounce Animation",
          description: "Create a bounce animation that moves an element up and down.",
          hint: "Use @keyframes with multiple percentage points for bounce effect.",
          solution: `@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.bounce {
  animation: bounce 0.5s ease infinite;
}`
        },
        {
          id: "css-e-2",
          title: "BEM Naming",
          description: "Create a menu component using BEM methodology with items and active state.",
          hint: "Use block__element--modifier pattern.",
          solution: `.menu { }
.menu__item { }
.menu__item--active { }
.menu__link { }`
        },
        {
          id: "css-e-3",
          title: "Responsive Auto-fit Grid",
          description: "Create a grid that automatically adjusts columns based on container width.",
          hint: "Use repeat(auto-fit, minmax()) pattern.",
          solution: `.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}`
        },
        {
          id: "css-e-4",
          title: "CSS Theme Variables",
          description: "Create dark theme variables for background, text, and accent colors.",
          hint: "Define CSS custom properties for dark theme.",
          solution: `[data-theme="dark"] {
  --bg-primary: #1a1a1a;
  --text-primary: #ffffff;
  --accent-color: #4dabf7;
}`
        },
        {
          id: "css-e-5",
          title: "Transform on Hover",
          description: "Make a card scale up and add shadow on hover with smooth transition.",
          hint: "Use transform: scale() and box-shadow with transition.",
          solution: `.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}`
        }
      ]
    }
  ]
},

  // JavaScript Pathway
{
  id: 4,
  title: "JavaScript",
  icon: "fa-js",
  description: "JavaScript is the language that makes websites interactive. With it, you can create buttons that work, forms that check input, sliders, animations, and more. Learning JavaScript allows you to bring your web pages to life.",
  color: "#ffcc00",
  slug: "javascript",
  levels: [
    {
      name: "Beginner",
      slug: "beginner",
      description: "Learn JavaScript fundamentals: variables, functions, DOM manipulation and simple events.",
      resources: [
        {
          title: "Variables and Data Types",
          description: "Learn to declare variables and work with different data types in JavaScript.",
          codeSnippet: `// Variable declaration
let name = "Junior";
const PI = 3.14;
var age = 20;

// Data types
let string = "Hello World";
let number = 42;
let boolean = true;
let array = [1, 2, 3];
let object = { key: "value" };
let nullValue = null;
let undefinedValue;

console.log(typeof name); // "string"
console.log(typeof number); // "number"`
        },
        {
          title: "Functions and Scope",
          description: "Create reusable code with functions and understand variable scope.",
          codeSnippet: `// Function declaration
function greet(name) {
  return "Hello " + name;
}

// Function expression
const multiply = function(a, b) {
  return a * b;
};

// Arrow function (ES6)
const divide = (a, b) => a / b;

// Calling functions
console.log(greet("Alice")); // "Hello Alice"
console.log(multiply(5, 3)); // 15
console.log(divide(10, 2)); // 5

// Scope example
let globalVar = "I'm global";

function testScope() {
  let localVar = "I'm local";
  console.log(globalVar); // Works
  console.log(localVar); // Works
}

testScope();
console.log(globalVar); // Works
// console.log(localVar); // Error - localVar not defined`
        },
        {
          title: "DOM Manipulation Basics",
          description: "Select and manipulate HTML elements using JavaScript.",
          codeSnippet: `// Selecting elements
const heading = document.getElementById('main-heading');
const paragraphs = document.getElementsByClassName('text');
const buttons = document.querySelectorAll('button');

// Changing content
heading.textContent = "New Heading";
heading.innerHTML = "<em>Formatted</em> Heading";

// Changing styles
heading.style.color = "blue";
heading.style.fontSize = "24px";

// Adding/removing classes
heading.classList.add('highlight');
heading.classList.remove('old-class');
heading.classList.toggle('active');

// Creating new elements
const newParagraph = document.createElement('p');
newParagraph.textContent = "This is a new paragraph";
document.body.appendChild(newParagraph);`
        },
        {
          title: "Events and Event Listeners",
          description: "Respond to user interactions like clicks, key presses, and form submissions.",
          codeSnippet: `// Click event
const button = document.querySelector('#myButton');
button.addEventListener('click', function() {
  alert('Button clicked!');
});

// Form submission
const form = document.querySelector('#myForm');
form.addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent page reload
  const input = document.querySelector('#name');
  console.log('Form submitted with:', input.value);
});

// Keyboard events
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    console.log('Escape pressed');
  }
});

// Mouse events
const box = document.querySelector('.box');
box.addEventListener('mouseover', function() {
  this.style.backgroundColor = 'lightblue';
});
box.addEventListener('mouseout', function() {
  this.style.backgroundColor = 'white';
});`
        },
        {
          title: "Arrays and Array Methods",
          description: "Work with arrays and use built-in methods to manipulate data.",
          codeSnippet: `// Creating arrays
let fruits = ['apple', 'banana', 'orange'];
let numbers = [1, 2, 3, 4, 5];

// Array methods
fruits.push('grape'); // Add to end
fruits.pop(); // Remove from end
fruits.unshift('strawberry'); // Add to beginning
fruits.shift(); // Remove from beginning

// Looping through arrays
for (let i = 0; i < fruits.length; i++) {
  console.log(fruits[i]);
}

// forEach method
fruits.forEach(function(fruit, index) {
  console.log(index + ': ' + fruit);
});

// map method
const doubled = numbers.map(num => num * 2);
console.log(doubled); // [2, 4, 6, 8, 10]

// filter method
const evenNumbers = numbers.filter(num => num % 2 === 0);
console.log(evenNumbers); // [2, 4]`
        }
      ],
      challenges: [
        {
          id: "js-b-1",
          title: "Hello World Function",
          description: "Create a function called sayHello that returns 'Hello, World!'",
          hint: "Use function declaration and return statement.",
          solution: `function sayHello() {
  return "Hello, World!";
}`
        },
        {
          id: "js-b-2",
          title: "Variable Operations",
          description: "Create two variables a=5 and b=3, then calculate and log their sum and product.",
          hint: "Use + for addition and * for multiplication.",
          solution: `let a = 5;
let b = 3;
console.log(a + b); // 8
console.log(a * b); // 15`
        },
        {
          id: "js-b-3",
          title: "DOM Text Change",
          description: "Select an element with id 'title' and change its text to 'JavaScript Rocks!'",
          hint: "Use document.getElementById() and textContent property.",
          solution: `document.getElementById('title').textContent = 'JavaScript Rocks!';`
        },
        {
          id: "js-b-4",
          title: "Click Event Handler",
          description: "Add a click event listener to a button that shows an alert 'Clicked!'",
          hint: "Use addEventListener with 'click' event type.",
          solution: `document.querySelector('button').addEventListener('click', function() {
  alert('Clicked!');
});`
        },
        {
          id: "js-b-5",
          title: "Array Manipulation",
          description: "Create an array [1,2,3,4], double each number using map, and log the result.",
          hint: "Use map method with arrow function.",
          solution: `let numbers = [1,2,3,4];
let doubled = numbers.map(num => num * 2);
console.log(doubled); // [2,4,6,8]`
        }
      ]
    },
    {
      name: "Intermediate",
      slug: "intermediate",
      description: "Dive into objects, advanced array methods, ES6+ features, and asynchronous programming.",
      resources: [
        {
          title: "Objects and Object Methods",
          description: "Work with objects, methods, and understand 'this' keyword context.",
          codeSnippet: `// Object literal
const person = {
  firstName: "John",
  lastName: "Doe",
  age: 30,
  
  // Method
  getFullName: function() {
    return this.firstName + " " + this.lastName;
  },
  
  // Shorthand method (ES6)
  greet() {
    return "Hello, " + this.firstName;
  }
};

console.log(person.firstName); // "John"
console.log(person.getFullName()); // "John Doe"
console.log(person.greet()); // "Hello, John"

// Object destructuring
const { firstName, age } = person;
console.log(firstName, age); // "John" 30

// Object spreading
const updatedPerson = { ...person, age: 31, city: "New York" };`
        },
        {
          title: "ES6+ Features",
          description: "Learn modern JavaScript features like template literals, destructuring, and modules.",
          codeSnippet: `// Template literals
const name = "Alice";
const greeting = \`Hello, \${name}!
Welcome to our website.\`;

console.log(greeting);

// Destructuring arrays
const colors = ['red', 'green', 'blue'];
const [firstColor, secondColor] = colors;
console.log(firstColor); // "red"

// Default parameters
function createUser(name, age = 18) {
  return { name, age };
}

// Modules (export/import)
// math.js
export const add = (a, b) => a + b;
export const PI = 3.14159;

// main.js
import { add, PI } from './math.js';`
        },
        {
          title: "Advanced Array Methods",
          description: "Master powerful array methods like reduce, find, some, and every.",
          codeSnippet: `const numbers = [1, 2, 3, 4, 5];

// reduce - accumulate values
const sum = numbers.reduce((total, num) => total + num, 0);
console.log(sum); // 15

// find - find first matching element
const firstEven = numbers.find(num => num % 2 === 0);
console.log(firstEven); // 2

// findIndex - find index of first matching element
const firstEvenIndex = numbers.findIndex(num => num % 2 === 0);
console.log(firstEvenIndex); // 1

// some - check if any element matches
const hasEven = numbers.some(num => num % 2 === 0);
console.log(hasEven); // true

// every - check if all elements match
const allPositive = numbers.every(num => num > 0);
console.log(allPositive); // true

// sort
const sorted = numbers.sort((a, b) => b - a); // descending
console.log(sorted); // [5, 4, 3, 2, 1]`
        },
        {
          title: "Asynchronous JavaScript - Callbacks and Promises",
          description: "Handle asynchronous operations with callbacks and promises.",
          codeSnippet: `// Callback example
function fetchData(callback) {
  setTimeout(() => {
    callback("Data received!");
  }, 1000);
}

fetchData((data) => {
  console.log(data); // "Data received!" after 1 second
});

// Promise example
function fetchDataPromise() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const success = true;
      if (success) {
        resolve("Data fetched successfully!");
      } else {
        reject("Error fetching data");
      }
    }, 1000);
  });
}

fetchDataPromise()
  .then(data => console.log(data))
  .catch(error => console.error(error));

// Promise.all - multiple promises
const promise1 = Promise.resolve(3);
const promise2 = 42;
const promise3 = new Promise((resolve) => {
  setTimeout(resolve, 100, 'foo');
});

Promise.all([promise1, promise2, promise3]).then((values) => {
  console.log(values); // [3, 42, "foo"]
});`
        },
        {
          title: "Error Handling and Debugging",
          description: "Handle errors gracefully and use debugging techniques.",
          codeSnippet: `// Try-catch for error handling
try {
  // Code that might throw an error
  const result = riskyOperation();
  console.log(result);
} catch (error) {
  console.error('An error occurred:', error.message);
} finally {
  console.log('This always runs');
}

// Custom errors
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

function validateEmail(email) {
  if (!email.includes('@')) {
    throw new ValidationError('Invalid email address');
  }
}

// Debugging techniques
console.log('Debugging info:', variable);
console.table(arrayOfObjects);
console.time('timer');
// Some operation
console.timeEnd('timer');`
        }
      ],
      challenges: [
        {
          id: "js-i-1",
          title: "Object Method",
          description: "Create an object 'car' with properties make and model, and a method getInfo that returns 'Make: X, Model: Y'",
          hint: "Use object literal with method shorthand.",
          solution: `const car = {
  make: "Toyota",
  model: "Camry",
  getInfo() {
    return \`Make: \${this.make}, Model: \${this.model}\`;
  }
};`
        },
        {
          id: "js-i-2",
          title: "Array Reduce",
          description: "Use reduce to calculate the product of all numbers in [2,3,4]",
          hint: "Start with initial value 1 for multiplication.",
          solution: `const numbers = [2, 3, 4];
const product = numbers.reduce((total, num) => total * num, 1);
console.log(product); // 24`
        },
        {
          id: "js-i-3",
          title: "Promise Handling",
          description: "Create a promise that resolves with 'Success!' after 1 second and log the result.",
          hint: "Use setTimeout inside Promise constructor.",
          solution: `new Promise((resolve) => {
  setTimeout(() => resolve('Success!'), 1000);
}).then(result => console.log(result));`
        },
        {
          id: "js-i-4",
          title: "Template Literal",
          description: "Use template literal to create a string: 'User John is 25 years old' using variables.",
          hint: "Use backticks and ${} for variable interpolation.",
          solution: `const name = "John";
const age = 25;
console.log(\`User \${name} is \${age} years old\`);`
        },
        {
          id: "js-i-5",
          title: "Error Handling",
          description: "Wrap JSON.parse in try-catch to handle invalid JSON gracefully.",
          hint: "Catch the error and log a user-friendly message.",
          solution: `try {
  JSON.parse("invalid json");
} catch (error) {
  console.log("Invalid JSON provided");
}`
        }
      ]
    },
    {
      name: "Expert",
      slug: "expert",
      description: "Master advanced JavaScript concepts including async/await, closures, functional programming, and performance optimization.",
      resources: [
        {
          title: "Async/Await and Modern Async Patterns",
          description: "Use async/await for cleaner asynchronous code and handle multiple async operations.",
          codeSnippet: `// Basic async/await
async function fetchUserData() {
  try {
    const response = await fetch('https://api.example.com/user');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw error;
  }
}

// Multiple async operations
async function fetchMultipleData() {
  try {
    const [user, posts] = await Promise.all([
      fetch('/api/user').then(r => r.json()),
      fetch('/api/posts').then(r => r.json())
    ]);
    return { user, posts };
  } catch (error) {
    console.error('One of the requests failed:', error);
  }
}

// Async function in arrow function
const fetchData = async (url) => {
  const response = await fetch(url);
  return response.json();
};

// Error handling patterns
async function robustFetch(url) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);
  
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      console.log('Request timed out');
    }
    throw error;
  }
}`
        },
        {
          title: "Closures and Higher-Order Functions",
          description: "Understand closures and create higher-order functions for functional programming.",
          codeSnippet: `// Closure example
function createCounter() {
  let count = 0;
  return function() {
    count++;
    return count;
  };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2

// Higher-order functions
function multiplyBy(factor) {
  return function(number) {
    return number * factor;
  };
}

const double = multiplyBy(2);
const triple = multiplyBy(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15

// Function composition
const compose = (...fns) => (x) => fns.reduceRight((acc, fn) => fn(acc), x);
const pipe = (...fns) => (x) => fns.reduce((acc, fn) => fn(acc), x);

const add5 = x => x + 5;
const multiply2 = x => x * 2;

const addThenMultiply = pipe(add5, multiply2);
console.log(addThenMultiply(10)); // 30`
        },
        {
          title: "Functional Programming Concepts",
          description: "Apply functional programming principles with pure functions and immutability.",
          codeSnippet: `// Pure function (no side effects, same input = same output)
const pureAdd = (a, b) => a + b;

// Impure function (has side effects)
let total = 0;
const impureAdd = (amount) => {
  total += amount; // Modifies external state
  return total;
};

// Immutability with spread and Object.freeze
const originalArray = [1, 2, 3];
const newArray = [...originalArray, 4]; // Doesn't modify original

const person = Object.freeze({
  name: "John",
  address: Object.freeze({
    city: "New York"
  })
});

// person.name = "Jane"; // Error in strict mode

// Currying
const curry = (fn) => {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    } else {
      return function(...args2) {
        return curried.apply(this, args.concat(args2));
      };
    }
  };
};

const add = (a, b, c) => a + b + c;
const curriedAdd = curry(add);
console.log(curriedAdd(1)(2)(3)); // 6`
        },
        {
          title: "Advanced ES6+ Features",
          description: "Master advanced features like proxies, generators, and reflection.",
          codeSnippet: `// Proxy for advanced object control
const handler = {
  get: function(obj, prop) {
    return prop in obj ? obj[prop] : 'Property not found';
  },
  set: function(obj, prop, value) {
    if (prop === 'age' && typeof value !== 'number') {
      throw new Error('Age must be a number');
    }
    obj[prop] = value;
    return true;
  }
};

const person = new Proxy({}, handler);
person.age = 30;
console.log(person.age); // 30
console.log(person.name); // "Property not found"

// Generators for lazy evaluation
function* numberGenerator() {
  let num = 1;
  while (true) {
    yield num++;
  }
}

const gen = numberGenerator();
console.log(gen.next().value); // 1
console.log(gen.next().value); // 2

// Symbol for unique properties
const uniqueKey = Symbol('description');
const obj = {
  [uniqueKey]: 'This is unique'
};
console.log(obj[uniqueKey]); // "This is unique"`

        },
        {
          title: "Performance Optimization and Memory Management",
          description: "Optimize JavaScript performance and understand memory management.",
          codeSnippet: `// Debouncing for performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Usage: prevent rapid fire on scroll/resize
window.addEventListener('resize', debounce(() => {
  console.log('Window resized');
}, 250));

// Memoization for expensive functions
function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

const expensiveCalculation = memoize((n) => {
  console.log('Calculating...');
  return n * n;
});

// Web Workers for CPU-intensive tasks
// main.js
const worker = new Worker('worker.js');
worker.postMessage({ data: 'heavy computation' });
worker.onmessage = (e) => {
  console.log('Result:', e.data);
};

// worker.js
self.onmessage = (e) => {
  const result = performHeavyComputation(e.data);
  self.postMessage(result);
};`
        }
      ],
      challenges: [
        {
          id: "js-e-1",
          title: "Async/Await Fetch",
          description: "Use async/await to fetch data from an API and handle errors with try/catch.",
          hint: "Use fetch with await and wrap in try-catch block.",
          solution: `async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    if (!response.ok) throw new Error('Network error');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch failed:', error);
  }
}`
        },
        {
          id: "js-e-2",
          title: "Closure Counter",
          description: "Create a counter using closure that can increment, decrement, and get value.",
          hint: "Return an object with methods that access the closed-over variable.",
          solution: `function createCounter() {
  let count = 0;
  return {
    increment() { count++; },
    decrement() { count--; },
    getValue() { return count; }
  };
}`
        },
        {
          id: "js-e-3",
          title: "Function Composition",
          description: "Create a compose function that combines multiple functions from right to left.",
          hint: "Use reduceRight to apply functions in reverse order.",
          solution: `const compose = (...fns) => (x) => 
  fns.reduceRight((acc, fn) => fn(acc), x);`
        },
        {
          id: "js-e-4",
          title: "Debounce Implementation",
          description: "Implement a debounce function that delays function execution.",
          hint: "Use setTimeout and clear previous timeout on new calls.",
          solution: `function debounce(fn, delay) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), delay);
  };
}`
        },
        {
          id: "js-e-5",
          title: "Promise Retry Logic",
          description: "Create a function that retries a promise up to 3 times on failure.",
          hint: "Use recursion or loop with try-catch in async function.",
          solution: `async function retry(fn, retries = 3) {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    return retry(fn, retries - 1);
  }
}`
        }
      ]
    }
  ]
},

  // Python Pathway
{
  id: 5,
  title: "Python",
  icon: "fa-python",
  description: "Python is a simple and beginner-friendly programming language used for websites, games, data analysis, and even artificial intelligence. It's known for being easy to read and write, so you can focus on solving problems rather than dealing with complicated code rules.",
  color: "#9d4edd",
  slug: "python",
  levels: [
    {
      name: "Beginner",
      slug: "beginner",
      description: "Start with Python basics: syntax, data types, control structures, and simple programs.",
      resources: [
        {
          title: "Python Syntax and Basic Output",
          description: "Learn Python's clean syntax and how to display output using print().",
          codeSnippet: `# Basic print statements
print("Hello, World!")
print(2 + 3)
print("Python" + " is" + " awesome!")

# Variables and basic operations
name = "Alice"
age = 25
height = 5.8
is_student = True

print(f"Name: {name}, Age: {age}")  # f-string formatting
print("Name:", name, "Age:", age)   # Multiple arguments`
        },
        {
          title: "Data Types and Variables",
          description: "Understand Python's dynamic typing and work with different data types.",
          codeSnippet: `# Basic data types
integer_num = 42
float_num = 3.14
text = "Hello Python"
boolean = True
none_value = None

# Type checking and conversion
print(type(integer_num))  # <class 'int'>
print(type(text))         # <class 'str'>

# Type conversion
num_str = "123"
num_int = int(num_str)
num_float = float(num_str)
str_num = str(42)

# Collections
my_list = [1, 2, 3, "hello"]
my_tuple = (1, 2, 3)  # Immutable
my_dict = {"name": "John", "age": 30}
my_set = {1, 2, 3, 3, 2}  # {1, 2, 3} - duplicates removed`
        },
        {
          title: "Control Flow - Conditionals and Loops",
          description: "Use if/else statements and loops to control program execution.",
          codeSnippet: `# If-elif-else statements
age = 20
if age < 13:
    print("Child")
elif age < 20:
    print("Teenager")
else:
    print("Adult")

# For loops
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)

# For loop with range
for i in range(5):        # 0 to 4
    print(i)

for i in range(1, 6):     # 1 to 5
    print(i)

# While loop
count = 0
while count < 5:
    print(count)
    count += 1

# Loop control
for i in range(10):
    if i == 3:
        continue  # Skip this iteration
    if i == 7:
        break     # Exit loop
    print(i)`
        },
        {
          title: "Functions and Basic I/O",
          description: "Create reusable functions and handle basic input/output operations.",
          codeSnippet: `# Function definition
def greet(name):
    return f"Hello, {name}!"

# Function with multiple parameters
def add_numbers(a, b):
    return a + b

# Function with default parameters
def introduce(name, age=18):
    return f"I'm {name} and I'm {age} years old"

# Calling functions
result = greet("Alice")
print(result)  # Hello, Alice!

sum_result = add_numbers(5, 3)
print(sum_result)  # 8

# Basic input
name = input("Enter your name: ")
age = input("Enter your age: ")
print(f"Welcome {name}, you are {age} years old!")

# File I/O basics
# Writing to a file
with open("example.txt", "w") as file:
    file.write("Hello, file!")

# Reading from a file
with open("example.txt", "r") as file:
    content = file.read()
    print(content)`
        },
        {
          title: "Lists and List Operations",
          description: "Work with Python lists - the most versatile sequence type.",
          codeSnippet: `# Creating lists
numbers = [1, 2, 3, 4, 5]
mixed = [1, "hello", 3.14, True]
empty_list = []

# List operations
numbers.append(6)           # Add to end
numbers.insert(0, 0)        # Insert at index
removed = numbers.pop()      # Remove from end
removed2 = numbers.pop(0)   # Remove from index
numbers.remove(3)           # Remove first occurrence of value

# List slicing
print(numbers[1:3])    # Elements from index 1 to 2
print(numbers[:3])     # First 3 elements
print(numbers[3:])     # From index 3 to end
print(numbers[-1])     # Last element

# List comprehension (powerful!)
squares = [x**2 for x in range(1, 6)]  # [1, 4, 9, 16, 25]
even_squares = [x**2 for x in range(1, 11) if x % 2 == 0]

# List methods
numbers.sort()                    # Sort in place
sorted_numbers = sorted(numbers)  # Return new sorted list
numbers.reverse()                 # Reverse in place
length = len(numbers)             # Get length`
        }
      ],
      challenges: [
        {
          id: "py-b-1",
          title: "Hello World with Variables",
          description: "Create variables for name and age, then print: 'Hello [name], you are [age] years old!'",
          hint: "Use f-strings or string concatenation with print().",
          solution: `name = "Alice"
age = 25
print(f"Hello {name}, you are {age} years old!")`
        },
        {
          id: "py-b-2",
          title: "Simple Calculator",
          description: "Create a function that takes two numbers and returns their sum and product.",
          hint: "Define a function with two parameters and return multiple values.",
          solution: `def calculator(a, b):
    return a + b, a * b

sum_result, product_result = calculator(5, 3)
print(f"Sum: {sum_result}, Product: {product_result}")`
        },
        {
          id: "py-b-3",
          title: "Even Number Check",
          description: "Write a function that takes a number and returns True if it's even, False otherwise.",
          hint: "Use modulo operator % to check divisibility by 2.",
          solution: `def is_even(num):
    return num % 2 == 0

print(is_even(4))  # True
print(is_even(7))  # False`
        },
        {
          id: "py-b-4",
          title: "List Manipulation",
          description: "Create a list [1,2,3,4,5], remove the middle element, and add 10 at the end.",
          hint: "Use pop() to remove and append() to add.",
          solution: `numbers = [1, 2, 3, 4, 5]
numbers.pop(2)  # Remove element at index 2 (value 3)
numbers.append(10)
print(numbers)  # [1, 2, 4, 5, 10]`
        },
        {
          id: "py-b-5",
          title: "For Loop with Range",
          description: "Use a for loop to print numbers from 1 to 10, but skip 5.",
          hint: "Use range(1, 11) and continue statement when i == 5.",
          solution: `for i in range(1, 11):
    if i == 5:
        continue
    print(i)`
        }
      ]
    },
    {
      name: "Intermediate",
      slug: "intermediate",
      description: "Learn Object-Oriented Programming, error handling, modules, and working with files.",
      resources: [
        {
          title: "Object-Oriented Programming (OOP)",
          description: "Create classes and objects to model real-world entities using Python's OOP features.",
          codeSnippet: `# Basic class definition
class Dog:
    # Class attribute
    species = "Canis familiaris"
    
    # Constructor
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    # Instance method
    def bark(self):
        return f"{self.name} says woof!"
    
    def __str__(self):
        return f"{self.name} is {self.age} years old"

# Creating objects
my_dog = Dog("Buddy", 3)
print(my_dog.bark())  # Buddy says woof!
print(my_dog)         # Buddy is 3 years old

# Inheritance
class GermanShepherd(Dog):
    def __init__(self, name, age, color):
        super().__init__(name, age)
        self.color = color
    
    # Method overriding
    def bark(self):
        return f"{self.name} says WOOF loudly!"

gs_dog = GermanShepherd("Rex", 2, "black")
print(gs_dog.bark())  # Rex says WOOF loudly!`
        },
        {
          title: "Error Handling with Try/Except",
          description: "Handle exceptions gracefully to make robust programs that don't crash on errors.",
          codeSnippet: `# Basic try-except
try:
    number = int(input("Enter a number: "))
    result = 10 / number
    print(f"Result: {result}")
except ValueError:
    print("That's not a valid number!")
except ZeroDivisionError:
    print("You can't divide by zero!")
except Exception as e:
    print(f"An unexpected error occurred: {e}")
else:
    print("Division successful!")
finally:
    print("This always executes")

# Raising custom exceptions
def validate_age(age):
    if age < 0:
        raise ValueError("Age cannot be negative")
    if age > 150:
        raise ValueError("Age seems unrealistic")
    return True

try:
    validate_age(-5)
except ValueError as e:
    print(f"Validation error: {e}")

# Custom exception class
class InvalidEmailError(Exception):
    def __init__(self, email):
        self.email = email
        super().__init__(f"Invalid email format: {email}")`
        },
        {
          title: "Working with Files and Directories",
          description: "Read, write, and manipulate files and directories using Python's file operations.",
          codeSnippet: `# Different file modes
# 'r' - read, 'w' - write, 'a' - append, 'r+' - read/write

# Reading files
with open('data.txt', 'r') as file:
    content = file.read()           # Read entire file
    # content = file.readlines()    # Read as list of lines

# Writing files
with open('output.txt', 'w') as file:
    file.write("Line 1\\n")
    file.write("Line 2\\n")

# Appending to files
with open('output.txt', 'a') as file:
    file.write("Line 3 (appended)\\n")

# Working with CSV files
import csv

# Writing CSV
with open('data.csv', 'w', newline='') as file:
    writer = csv.writer(file)
    writer.writerow(['Name', 'Age', 'City'])
    writer.writerow(['Alice', 25, 'New York'])
    writer.writerow(['Bob', 30, 'London'])

# Reading CSV
with open('data.csv', 'r') as file:
    reader = csv.reader(file)
    for row in reader:
        print(row)`
        },
        {
          title: "Modules and Packages",
          description: "Organize code into modules and packages for better code organization and reusability.",
          codeSnippet: `# Creating a module (math_operations.py)
# math_operations.py content:
"""
A simple math operations module.
"""
def add(a, b):
    return a + b

def multiply(a, b):
    return a * b

PI = 3.14159

# Using the module
import math_operations as mo
from math_operations import add, PI

result1 = mo.multiply(4, 5)
result2 = add(3, 7)
print(f"Results: {result1}, {result2}, PI: {PI}")

# Using Python standard library modules
import math
import random
import datetime
import os

print(math.sqrt(16))                    # 4.0
print(random.randint(1, 10))           # Random number
print(datetime.datetime.now())         # Current date/time
print(os.getcwd())                     # Current working directory

# Creating packages
# mypackage/
#   __init__.py
#   module1.py
#   module2.py`
        },
        {
          title: "List Comprehensions and Generator Expressions",
          description: "Use advanced comprehension techniques for concise and efficient code.",
          codeSnippet: `# Basic list comprehension
numbers = [1, 2, 3, 4, 5]
squares = [x**2 for x in numbers]  # [1, 4, 9, 16, 25]

# List comprehension with condition
even_squares = [x**2 for x in numbers if x % 2 == 0]  # [4, 16]

# Nested list comprehension
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
flattened = [num for row in matrix for num in row]  # [1, 2, 3, 4, 5, 6, 7, 8, 9]

# Dictionary comprehension
squares_dict = {x: x**2 for x in range(1, 6)}  # {1: 1, 2: 4, 3: 9, 4: 16, 5: 25}

# Set comprehension
unique_squares = {x**2 for x in [1, 2, 2, 3, 3, 4]}  # {1, 4, 9, 16}

# Generator expressions (memory efficient)
large_squares = (x**2 for x in range(1000000))  # Doesn't create list immediately
for square in large_squares:
    if square > 100:
        break
    print(square)`
        }
      ],
      challenges: [
        {
          id: "py-i-1",
          title: "Class with Methods",
          description: "Create a 'BankAccount' class with deposit, withdraw, and get_balance methods.",
          hint: "Use __init__ for initial balance and instance methods for operations.",
          solution: `class BankAccount:
    def __init__(self, initial_balance=0):
        self.balance = initial_balance
    
    def deposit(self, amount):
        self.balance += amount
        return self.balance
    
    def withdraw(self, amount):
        if amount <= self.balance:
            self.balance -= amount
            return self.balance
        else:
            return "Insufficient funds"
    
    def get_balance(self):
        return self.balance`
        },
        {
          id: "py-i-2",
          title: "Error Handling Function",
          description: "Create a function that divides two numbers and handles division by zero gracefully.",
          hint: "Use try-except block to catch ZeroDivisionError.",
          solution: `def safe_divide(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        return "Cannot divide by zero"

print(safe_divide(10, 2))  # 5.0
print(safe_divide(10, 0))  # Cannot divide by zero`
        },
        {
          id: "py-i-3",
          title: "List Comprehension",
          description: "Use list comprehension to create a list of squared even numbers from 1 to 10.",
          hint: "Combine range, condition for even numbers, and squaring in comprehension.",
          solution: `even_squares = [x**2 for x in range(1, 11) if x % 2 == 0]
print(even_squares)  # [4, 16, 36, 64, 100]`
        },
        {
          id: "py-i-4",
          title: "File Processing",
          description: "Read a file and count how many lines contain the word 'Python'.",
          hint: "Use open() with 'r' mode and check each line.",
          solution: `count = 0
with open('file.txt', 'r') as file:
    for line in file:
        if 'Python' in line:
            count += 1
print(f"Found 'Python' in {count} lines")`
        },
        {
          id: "py-i-5",
          title: "Dictionary Comprehension",
          description: "Create a dictionary where keys are numbers 1-5 and values are their cubes.",
          hint: "Use dictionary comprehension with range.",
          solution: `cubes = {x: x**3 for x in range(1, 6)}
print(cubes)  # {1: 1, 2: 8, 3: 27, 4: 64, 5: 125}`
        }
      ]
    },
    {
      name: "Expert",
      slug: "expert",
      description: "Master advanced Python concepts including decorators, generators, context managers, and popular libraries.",
      resources: [
        {
          title: "Decorators and Higher-Order Functions",
          description: "Use decorators to modify function behavior and create powerful abstractions.",
          codeSnippet: `# Basic decorator
def my_decorator(func):
    def wrapper():
        print("Something is happening before the function is called.")
        func()
        print("Something is happening after the function is called.")
    return wrapper

@my_decorator
def say_hello():
    print("Hello!")

say_hello()

# Decorator with arguments
def repeat(num_times):
    def decorator_repeat(func):
        def wrapper(*args, **kwargs):
            for _ in range(num_times):
                result = func(*args, **kwargs)
            return result
        return wrapper
    return decorator_repeat

@repeat(num_times=3)
def greet(name):
    print(f"Hello {name}")

greet("Alice")

# Class-based decorator
class CountCalls:
    def __init__(self, func):
        self.func = func
        self.num_calls = 0
    
    def __call__(self, *args, **kwargs):
        self.num_calls += 1
        print(f"Call {self.num_calls} of {self.func.__name__}")
        return self.func(*args, **kwargs)

@CountCalls
def say_hello():
    print("Hello!")

say_hello()
say_hello()`
        },
        {
          title: "Generators and Iterators",
          description: "Create memory-efficient generators and understand Python's iteration protocol.",
          codeSnippet: `# Generator function
def fibonacci(limit):
    a, b = 0, 1
    while a < limit:
        yield a
        a, b = b, a + b

# Using generator
for num in fibonacci(100):
    print(num)

# Generator expression
squares_gen = (x**2 for x in range(1000000))  # Memory efficient

# Custom iterator class
class Countdown:
    def __init__(self, start):
        self.current = start
    
    def __iter__(self):
        return self
    
    def __next__(self):
        if self.current <= 0:
            raise StopIteration
        else:
            self.current -= 1
            return self.current + 1

for number in Countdown(5):
    print(number)  # 5, 4, 3, 2, 1`
        },
        {
          title: "Context Managers and With Statement",
          description: "Use context managers for proper resource management and clean code.",
          codeSnippet: `# Class-based context manager
class FileManager:
    def __init__(self, filename, mode):
        self.filename = filename
        self.mode = mode
        self.file = None
    
    def __enter__(self):
        self.file = open(self.filename, self.mode)
        return self.file
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.file:
            self.file.close()

# Using context manager
with FileManager('test.txt', 'w') as f:
    f.write('Hello, context manager!')

# Context manager using contextlib
from contextlib import contextmanager

@contextmanager
def timer():
    import time
    start = time.time()
    try:
        yield
    finally:
        end = time.time()
        print(f"Elapsed time: {end - start:.2f} seconds")

with timer():
    # Code to time
    sum(range(1000000))

# Multiple context managers
with open('input.txt', 'r') as input_file, open('output.txt', 'w') as output_file:
    content = input_file.read()
    output_file.write(content.upper())`
        },
        {
          title: "Advanced OOP - Magic Methods and Properties",
          description: "Use Python's magic methods and properties for intuitive class design.",
          codeSnippet: `class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y
    
    # String representation
    def __str__(self):
        return f"Vector({self.x}, {self.y})"
    
    def __repr__(self):
        return f"Vector({self.x}, {self.y})"
    
    # Arithmetic operations
    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)
    
    def __mul__(self, scalar):
        return Vector(self.x * scalar, self.y * scalar)
    
    # Comparison
    def __eq__(self, other):
        return self.x == other.x and self.y == other.y
    
    # Length
    def __len__(self):
        return 2
    
    # Properties
    @property
    def magnitude(self):
        return (self.x**2 + self.y**2)**0.5
    
    @property
    def direction(self):
        return f"({self.x}, {self.y})"

# Using the Vector class
v1 = Vector(2, 3)
v2 = Vector(1, 1)
v3 = v1 + v2  # Vector(3, 4)
v4 = v1 * 2   # Vector(4, 6)
print(v3.magnitude)  # 5.0`
        },
        {
          title: "Popular Python Libraries",
          description: "Explore essential Python libraries for data analysis, web development, and more.",
          codeSnippet: `# NumPy for numerical computing
import numpy as np

arr = np.array([1, 2, 3, 4, 5])
print(arr * 2)  # [ 2  4  6  8 10]
print(arr.sum())  # 15

# Pandas for data analysis
import pandas as pd

data = {'Name': ['Alice', 'Bob', 'Charlie'],
        'Age': [25, 30, 35],
        'City': ['New York', 'London', 'Tokyo']}
df = pd.DataFrame(data)
print(df)
print(df[df['Age'] > 28])

# Requests for HTTP
import requests

response = requests.get('https://api.github.com')
print(response.status_code)
# print(response.json())

# Regular expressions
import re

text = "Contact us at info@example.com or support@company.org"
emails = re.findall(r'\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b', text)
print(emails)  # ['info@example.com', 'support@company.org']`
        }
      ],
      challenges: [
        {
          id: "py-e-1",
          title: "Timer Decorator",
          description: "Create a decorator that measures and prints the execution time of a function.",
          hint: "Use time module and wrapper function to calculate elapsed time.",
          solution: `import time

def timer(func):
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__} took {end - start:.4f} seconds")
        return result
    return wrapper

@timer
def slow_function():
    time.sleep(1)

slow_function()`
        },
        {
          id: "py-e-2",
          title: "Fibonacci Generator",
          description: "Create a generator that yields Fibonacci numbers up to a given limit.",
          hint: "Use yield in a while loop with the Fibonacci sequence logic.",
          solution: `def fibonacci(limit):
    a, b = 0, 1
    while a < limit:
        yield a
        a, b = b, a + b

for num in fibonacci(100):
    print(num)`
        },
        {
          id: "py-e-3",
          title: "Context Manager for Database",
          description: "Create a context manager that automatically closes a database connection.",
          hint: "Implement __enter__ and __exit__ methods in a class.",
          solution: `class DatabaseConnection:
    def __init__(self, db_name):
        self.db_name = db_name
        self.connection = None
    
    def __enter__(self):
        self.connection = f"Connected to {self.db_name}"
        print(self.connection)
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        print(f"Closed connection to {self.db_name}")

with DatabaseConnection("my_database") as db:
    print("Performing database operations...")`
        },
        {
          id: "py-e-4",
          title: "Custom Range Class",
          description: "Create a custom Range class that works like built-in range but with __iter__ and __next__.",
          hint: "Implement iterator protocol with __iter__ and __next__ methods.",
          solution: `class MyRange:
    def __init__(self, start, stop=None, step=1):
        if stop is None:
            self.start = 0
            self.stop = start
        else:
            self.start = start
            self.stop = stop
        self.step = step
        self.current = self.start
    
    def __iter__(self):
        return self
    
    def __next__(self):
        if (self.step > 0 and self.current >= self.stop) or \\
           (self.step < 0 and self.current <= self.stop):
            raise StopIteration
        current = self.current
        self.current += self.step
        return current

for i in MyRange(5):
    print(i)  # 0, 1, 2, 3, 4`
        },
        {
          id: "py-e-5",
          title: "Data Processing with List Comprehension",
          description: "Process a list of strings to extract numbers and calculate their sum using comprehension.",
          hint: "Use nested list comprehension with try-except for conversion.",
          solution: `data = ["apple", "123", "45.6", "banana", "7.8", "100"]
numbers = [float(x) for x in data if x.replace('.', '').isdigit()]
total = sum(numbers)
print(f"Total: {total}")  # Total: 276.4`
        }
      ]
    }
  ]
},
  // Databases Pathway
{
  id: 6,
  title: "Databases",
  icon: "fa-database",
  description: "Databases are where information is stored and organized so computers can find it quickly. They are used in apps, websites, and businesses to keep track of data like users, products, or transactions. Learning databases teaches you how to store, manage, and retrieve information efficiently.",
  color: "#f8961e",
  slug: "databases",
  levels: [
    {
      name: "Beginner",
      slug: "beginner",
      description: "Learn basic database concepts, SQL syntax, and simple CRUD operations.",
      resources: [
        {
          title: "Database Fundamentals and SQL Basics",
          description: "Understand what databases are and learn basic SQL commands for data manipulation.",
          codeSnippet: `-- Creating a database
CREATE DATABASE school;

-- Using the database
USE school;

-- Creating tables
CREATE TABLE students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    age INT,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE courses (
    course_id INT PRIMARY KEY AUTO_INCREMENT,
    course_name VARCHAR(100) NOT NULL,
    instructor VARCHAR(50)
);

-- Basic data types
-- INT, VARCHAR(n), TEXT, DATE, TIMESTAMP, DECIMAL, BOOLEAN`
        },
        {
          title: "INSERT, SELECT, and Basic Queries",
          description: "Learn to add data and retrieve it using SELECT statements with basic filtering.",
          codeSnippet: `-- Inserting data
INSERT INTO students (name, age, email) 
VALUES 
('Alice Johnson', 20, 'alice@email.com'),
('Bob Smith', 22, 'bob@email.com'),
('Carol Davis', 19, 'carol@email.com');

INSERT INTO courses (course_name, instructor)
VALUES 
('Mathematics', 'Dr. Wilson'),
('Computer Science', 'Prof. Lee'),
('Physics', 'Dr. Brown');

-- Basic SELECT queries
SELECT * FROM students;  -- Get all students
SELECT name, age FROM students;  -- Specific columns
SELECT DISTINCT age FROM students;  -- Unique values

-- WHERE clause for filtering
SELECT * FROM students WHERE age > 20;
SELECT * FROM students WHERE name LIKE 'A%';  -- Names starting with A
SELECT * FROM students WHERE email IS NOT NULL;`
        },
        {
          title: "UPDATE and DELETE Operations",
          description: "Modify and remove data from tables using UPDATE and DELETE statements.",
          codeSnippet: `-- UPDATE existing records
UPDATE students 
SET age = 21, email = 'newemail@example.com'
WHERE name = 'Alice Johnson';

-- Update multiple records
UPDATE students 
SET age = age + 1 
WHERE age < 22;

-- DELETE records
DELETE FROM students 
WHERE name = 'Bob Smith';

-- Delete all records (be careful!)
-- DELETE FROM students;

-- Safe delete with conditions
DELETE FROM students 
WHERE age IS NULL OR email IS NULL;`
        },
        {
          title: "Basic Table Relationships",
          description: "Understand and create relationships between tables using foreign keys.",
          codeSnippet: `-- Creating a table with foreign key
CREATE TABLE enrollments (
    enrollment_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT,
    course_id INT,
    enrollment_date DATE,
    grade DECIMAL(3,2),
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id)
);

-- Inserting related data
INSERT INTO enrollments (student_id, course_id, enrollment_date, grade)
VALUES 
(1, 1, '2024-01-15', 3.8),
(1, 2, '2024-01-15', 3.9),
(2, 1, '2024-01-16', 3.5),
(3, 3, '2024-01-17', 4.0);

-- Querying related tables
SELECT s.name, c.course_name, e.grade
FROM students s
JOIN enrollments e ON s.id = e.student_id
JOIN courses c ON e.course_id = c.course_id;`
        },
        {
          title: "Aggregate Functions and GROUP BY",
          description: "Use aggregate functions to perform calculations on groups of data.",
          codeSnippet: `-- Aggregate functions
SELECT COUNT(*) FROM students;  -- Total students
SELECT AVG(age) FROM students;  -- Average age
SELECT MAX(age) FROM students;  -- Maximum age
SELECT MIN(age) FROM students;  -- Minimum age
SELECT SUM(age) FROM students;  -- Sum of all ages

-- GROUP BY for grouped calculations
SELECT age, COUNT(*) as count
FROM students
GROUP BY age;

-- Average grade by course
SELECT c.course_name, AVG(e.grade) as average_grade
FROM enrollments e
JOIN courses c ON e.course_id = c.course_id
GROUP BY c.course_name;

-- HAVING clause for filtering groups
SELECT age, COUNT(*) as count
FROM students
GROUP BY age
HAVING COUNT(*) > 1;  -- Ages with more than one student`
        }
      ],
      challenges: [
        {
          id: "db-b-1",
          title: "Create Students Table",
          description: "Create a students table with id, name, major, and graduation_year columns.",
          hint: "Use CREATE TABLE with appropriate data types and PRIMARY KEY.",
          solution: `CREATE TABLE students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    major VARCHAR(50),
    graduation_year INT
);`
        },
        {
          id: "db-b-2",
          title: "Insert Student Records",
          description: "Insert three student records into the students table.",
          hint: "Use INSERT INTO with VALUES for multiple rows.",
          solution: `INSERT INTO students (name, major, graduation_year)
VALUES 
('John Doe', 'Computer Science', 2025),
('Jane Smith', 'Mathematics', 2024),
('Mike Johnson', 'Physics', 2026);`
        },
        {
          id: "db-b-3",
          title: "Basic SELECT with Filter",
          description: "Select names of students graduating in 2025 or later.",
          hint: "Use WHERE clause with >= operator.",
          solution: `SELECT name 
FROM students 
WHERE graduation_year >= 2025;`
        },
        {
          id: "db-b-4",
          title: "UPDATE Record",
          description: "Update Mike Johnson's major to 'Engineering'.",
          hint: "Use UPDATE with WHERE clause to target specific record.",
          solution: `UPDATE students 
SET major = 'Engineering' 
WHERE name = 'Mike Johnson';`
        },
        {
          id: "db-b-5",
          title: "Count Students by Major",
          description: "Count how many students are in each major.",
          hint: "Use COUNT() with GROUP BY.",
          solution: `SELECT major, COUNT(*) as student_count
FROM students
GROUP BY major;`
        }
      ]
    },
    {
      name: "Intermediate",
      slug: "intermediate",
      description: "Learn advanced SQL queries, joins, normalization, and database design principles.",
      resources: [
        {
          title: "JOIN Operations - Combining Tables",
          description: "Master different types of JOIN operations to combine data from multiple tables.",
          codeSnippet: `-- INNER JOIN (most common)
SELECT s.name, c.course_name, e.grade
FROM students s
INNER JOIN enrollments e ON s.id = e.student_id
INNER JOIN courses c ON e.course_id = c.course_id;

-- LEFT JOIN (all students, even without enrollments)
SELECT s.name, c.course_name, e.grade
FROM students s
LEFT JOIN enrollments e ON s.id = e.student_id
LEFT JOIN courses c ON e.course_id = c.course_id;

-- RIGHT JOIN (all courses, even without students)
SELECT s.name, c.course_name, e.grade
FROM students s
RIGHT JOIN enrollments e ON s.id = e.student_id
RIGHT JOIN courses c ON e.course_id = c.course_id;

-- FULL OUTER JOIN (all records from both tables)
-- Note: MySQL doesn't support FULL OUTER JOIN directly
SELECT s.name, c.course_name, e.grade
FROM students s
LEFT JOIN enrollments e ON s.id = e.student_id
LEFT JOIN courses c ON e.course_id = c.course_id
UNION
SELECT s.name, c.course_name, e.grade
FROM students s
RIGHT JOIN enrollments e ON s.id = e.student_id
RIGHT JOIN courses c ON e.course_id = c.course_id
WHERE s.id IS NULL;`
        },
        {
          title: "Subqueries and Common Table Expressions",
          description: "Use subqueries and CTEs for complex data retrieval and organization.",
          codeSnippet: `-- Subquery in WHERE clause
SELECT name, age
FROM students
WHERE age > (SELECT AVG(age) FROM students);

-- Subquery in SELECT clause
SELECT name, 
       (SELECT COUNT(*) 
        FROM enrollments e 
        WHERE e.student_id = s.id) as courses_taken
FROM students s;

-- Common Table Expression (CTE)
WITH top_students AS (
    SELECT student_id, AVG(grade) as avg_grade
    FROM enrollments
    GROUP BY student_id
    HAVING AVG(grade) > 3.5
)
SELECT s.name, ts.avg_grade
FROM students s
JOIN top_students ts ON s.id = ts.student_id;

-- Multiple CTEs
WITH course_stats AS (
    SELECT course_id, AVG(grade) as avg_grade, COUNT(*) as enrollment_count
    FROM enrollments
    GROUP BY course_id
),
popular_courses AS (
    SELECT course_id
    FROM course_stats
    WHERE enrollment_count > 10
)
SELECT c.course_name, cs.avg_grade, cs.enrollment_count
FROM courses c
JOIN course_stats cs ON c.course_id = cs.course_id
WHERE c.course_id IN (SELECT course_id FROM popular_courses);`
        },
        {
          title: "Database Normalization",
          description: "Organize databases to reduce redundancy and improve data integrity.",
          codeSnippet: `-- First Normal Form (1NF) - Atomic values
-- Bad: Storing multiple values in one column
CREATE TABLE bad_design (
    student_id INT,
    courses_taken VARCHAR(255)  -- 'Math,Science,History'
);

-- Good: Separate table for relationships
CREATE TABLE students_1nf (
    student_id INT PRIMARY KEY,
    name VARCHAR(50)
);

CREATE TABLE enrollments_1nf (
    enrollment_id INT PRIMARY KEY,
    student_id INT,
    course_id INT,
    FOREIGN KEY (student_id) REFERENCES students_1nf(student_id)
);

-- Second Normal Form (2NF) - No partial dependencies
-- Move course details to separate table
CREATE TABLE courses_2nf (
    course_id INT PRIMARY KEY,
    course_name VARCHAR(100),
    credits INT
);

-- Third Normal Form (3NF) - No transitive dependencies
-- Remove derived data
CREATE TABLE students_3nf (
    student_id INT PRIMARY KEY,
    name VARCHAR(50),
    birth_date DATE  -- Store birth date, not age (which can be calculated)
);

-- Example of denormalization for performance
-- Sometimes we break normalization for read performance
CREATE TABLE student_summary (
    student_id INT PRIMARY KEY,
    name VARCHAR(50),
    total_courses INT,
    average_grade DECIMAL(3,2)
);`
        },
        {
          title: "Indexes and Query Optimization",
          description: "Use indexes to improve query performance and understand execution plans.",
          codeSnippet: `-- Creating indexes
CREATE INDEX idx_student_name ON students(name);
CREATE INDEX idx_student_age ON students(age);
CREATE UNIQUE INDEX idx_student_email ON students(email);

-- Composite index
CREATE INDEX idx_enrollment_dates ON enrollments(student_id, enrollment_date);

-- Viewing indexes
SHOW INDEX FROM students;

-- Analyzing query performance with EXPLAIN
EXPLAIN SELECT * FROM students WHERE name = 'Alice Johnson';

-- Query optimization tips
-- Use WHERE instead of HAVING for filtering when possible
SELECT student_id, AVG(grade) 
FROM enrollments 
WHERE grade > 2.0  -- Filter early
GROUP BY student_id;

-- Avoid SELECT * - specify only needed columns
SELECT name, email FROM students;  -- Instead of SELECT *

-- Use LIMIT for testing large queries
SELECT * FROM students LIMIT 10;`
        },
        {
          title: "Transactions and ACID Properties",
          description: "Ensure data consistency with transactions and understand ACID properties.",
          codeSnippet: `-- Basic transaction
START TRANSACTION;

-- Multiple operations
UPDATE accounts SET balance = balance - 100 WHERE account_id = 1;
UPDATE accounts SET balance = balance + 100 WHERE account_id = 2;

-- Commit if all operations succeed
COMMIT;

-- Or rollback if any operation fails
-- ROLLBACK;

-- Transaction with error handling
START TRANSACTION;

BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    INSERT INTO orders (customer_id, total) VALUES (1, 99.99);
    UPDATE inventory SET quantity = quantity - 1 WHERE product_id = 5;
    
    COMMIT;
END;

-- ACID Properties:
-- Atomicity: All or nothing
-- Consistency: Valid state before and after
-- Isolation: Concurrent transactions don't interfere
-- Durability: Committed changes persist`
        }
      ],
      challenges: [
        {
          id: "db-i-1",
          title: "INNER JOIN Query",
          description: "Write a query that shows student names with their course names and grades.",
          hint: "Use INNER JOIN between students, enrollments, and courses tables.",
          solution: `SELECT s.name, c.course_name, e.grade
FROM students s
INNER JOIN enrollments e ON s.id = e.student_id
INNER JOIN courses c ON e.course_id = c.course_id;`
        },
        {
          id: "db-i-2",
          title: "Subquery for Above Average",
          description: "Find students who have a grade higher than the average grade.",
          hint: "Use a subquery in the WHERE clause to calculate average grade.",
          solution: `SELECT s.name, e.grade
FROM students s
JOIN enrollments e ON s.id = e.student_id
WHERE e.grade > (SELECT AVG(grade) FROM enrollments);`
        },
        {
          id: "db-i-3",
          title: "Create Composite Index",
          description: "Create an index on student_id and course_id in enrollments table.",
          hint: "Use CREATE INDEX with multiple columns.",
          solution: `CREATE INDEX idx_student_course ON enrollments(student_id, course_id);`
        },
        {
          id: "db-i-4",
          title: "Transaction for Transfer",
          description: "Write a transaction that transfers $50 from account 1 to account 2.",
          hint: "Use START TRANSACTION, multiple UPDATEs, and COMMIT.",
          solution: `START TRANSACTION;
UPDATE accounts SET balance = balance - 50 WHERE account_id = 1;
UPDATE accounts SET balance = balance + 50 WHERE account_id = 2;
COMMIT;`
        },
        {
          id: "db-i-5",
          title: "CTE for Student Statistics",
          description: "Use CTE to find students taking more than 2 courses.",
          hint: "Create CTE that counts courses per student, then filter.",
          solution: `WITH student_course_count AS (
    SELECT student_id, COUNT(*) as course_count
    FROM enrollments
    GROUP BY student_id
)
SELECT s.name, scc.course_count
FROM students s
JOIN student_course_count scc ON s.id = scc.student_id
WHERE scc.course_count > 2;`
        }
      ]
    },
    {
      name: "Expert",
      slug: "expert",
      description: "Master advanced database concepts including NoSQL, performance tuning, security, and distributed systems.",
      resources: [
        {
          title: "NoSQL Databases - MongoDB",
          description: "Work with document-based NoSQL databases using MongoDB.",
          codeSnippet: `// MongoDB JavaScript syntax
// Connecting to MongoDB
use university;

// Creating collections (similar to tables)
db.createCollection("students");
db.createCollection("courses");

// Inserting documents
db.students.insertOne({
    _id: 1,
    name: "Alice Johnson",
    age: 20,
    email: "alice@email.com",
    courses: ["Math", "Computer Science"],
    address: {
        street: "123 Main St",
        city: "Boston",
        zip: "02108"
    }
});

// Inserting multiple documents
db.students.insertMany([
    {
        _id: 2,
        name: "Bob Smith",
        age: 22,
        email: "bob@email.com",
        courses: ["Physics", "Math"]
    },
    {
        _id: 3,
        name: "Carol Davis",
        age: 19,
        email: "carol@email.com",
        courses: ["Computer Science", "History"]
    }
]);

// Querying documents
db.students.find();  // All students
db.students.find({age: {$gt: 20}});  // Age > 20
db.students.find({"address.city": "Boston"});  // Nested field

// Aggregation pipeline
db.students.aggregate([
    {$match: {age: {$gte: 20}}},
    {$group: {_id: "$age", count: {$sum: 1}}},
    {$sort: {count: -1}}
]);`
        },
        {
          title: "Advanced Query Optimization",
          description: "Use advanced techniques to optimize database performance.",
          codeSnippet: `-- Query execution plan analysis
EXPLAIN FORMAT=JSON 
SELECT s.name, c.course_name, e.grade
FROM students s
JOIN enrollments e ON s.id = e.student_id
JOIN courses c ON e.course_id = c.course_id
WHERE s.age > 20 AND e.grade > 3.0;

-- Using covering indexes
CREATE INDEX idx_covering ON enrollments(student_id, course_id, grade);

-- Partitioning large tables
CREATE TABLE enrollments_partitioned (
    enrollment_id INT,
    student_id INT,
    course_id INT,
    enrollment_date DATE,
    grade DECIMAL(3,2)
)
PARTITION BY RANGE (YEAR(enrollment_date)) (
    PARTITION p2020 VALUES LESS THAN (2021),
    PARTITION p2021 VALUES LESS THAN (2022),
    PARTITION p2022 VALUES LESS THAN (2023),
    PARTITION p2023 VALUES LESS THAN (2024)
);

-- Query hints
SELECT /*+ INDEX(students idx_student_age) */ name, age
FROM students 
WHERE age BETWEEN 20 AND 25;`
        },
        {
          title: "Database Security and User Management",
          description: "Implement security measures and manage user access to databases.",
          codeSnippet: `-- Creating users and granting permissions
CREATE USER 'app_user'@'localhost' IDENTIFIED BY 'secure_password';
CREATE USER 'readonly_user'@'%' IDENTIFIED BY 'readonly_pass';

-- Granting specific permissions
GRANT SELECT, INSERT, UPDATE ON school.* TO 'app_user'@'localhost';
GRANT SELECT ON school.students TO 'readonly_user'@'%';
GRANT SELECT ON school.courses TO 'readonly_user'@'%';

-- Revoking permissions
REVOKE DELETE ON school.* FROM 'app_user'@'localhost';

-- Viewing user privileges
SHOW GRANTS FOR 'app_user'@'localhost';

-- Creating roles (MySQL 8.0+)
CREATE ROLE 'student_reader', 'course_manager';
GRANT SELECT ON school.students TO 'student_reader';
GRANT SELECT, INSERT, UPDATE ON school.courses TO 'course_manager';
GRANT 'student_reader' TO 'readonly_user'@'%';

-- Database encryption
-- Enable table encryption
ALTER TABLE students ENCRYPTION='Y';
ALTER TABLE enrollments ENCRYPTION='Y';`
        },
        {
          title: "Stored Procedures and Functions",
          description: "Create reusable database logic with stored procedures and functions.",
          codeSnippet: `-- Stored procedure for student enrollment
DELIMITER //
CREATE PROCEDURE EnrollStudent(
    IN p_student_id INT,
    IN p_course_id INT,
    IN p_grade DECIMAL(3,2)
)
BEGIN
    DECLARE existing_count INT;
    
    -- Check if already enrolled
    SELECT COUNT(*) INTO existing_count
    FROM enrollments
    WHERE student_id = p_student_id AND course_id = p_course_id;
    
    IF existing_count = 0 THEN
        INSERT INTO enrollments (student_id, course_id, grade, enrollment_date)
        VALUES (p_student_id, p_course_id, p_grade, CURDATE());
        SELECT 'Enrollment successful' AS result;
    ELSE
        SELECT 'Student already enrolled in this course' AS result;
    END IF;
END //
DELIMITER ;

-- Using the stored procedure
CALL EnrollStudent(1, 2, 3.8);

-- Function to calculate student GPA
DELIMITER //
CREATE FUNCTION CalculateGPA(p_student_id INT) 
RETURNS DECIMAL(3,2)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE gpa DECIMAL(3,2);
    
    SELECT AVG(grade) INTO gpa
    FROM enrollments
    WHERE student_id = p_student_id;
    
    RETURN COALESCE(gpa, 0);
END //
DELIMITER ;

-- Using the function
SELECT name, CalculateGPA(id) as gpa FROM students;`
        },
        {
          title: "Database Replication and High Availability",
          description: "Set up database replication for high availability and disaster recovery.",
          codeSnippet: `-- Master database configuration (my.cnf)
[mysqld]
server-id=1
log-bin=mysql-bin
binlog-format=ROW

-- Slave database configuration
[mysqld]
server-id=2
relay-log=mysql-relay-bin
read-only=1

-- On master: create replication user
CREATE USER 'repl'@'%' IDENTIFIED BY 'repl_password';
GRANT REPLICATION SLAVE ON *.* TO 'repl'@'%';

-- On master: get binary log position
SHOW MASTER STATUS;

-- On slave: configure replication
CHANGE MASTER TO
MASTER_HOST='master_host',
MASTER_USER='repl',
MASTER_PASSWORD='repl_password',
MASTER_LOG_FILE='mysql-bin.000001',
MASTER_LOG_POS=107;

-- Start replication on slave
START SLAVE;

-- Monitor replication status
SHOW SLAVE STATUS\\G

-- Database clustering with Group Replication (MySQL InnoDB Cluster)
-- Provides automatic failover and load balancing`
        }
      ],
      challenges: [
        {
          id: "db-e-1",
          title: "MongoDB Aggregation",
          description: "Create a MongoDB aggregation that groups students by age and counts them.",
          hint: "Use $group stage with $sum in aggregation pipeline.",
          solution: `db.students.aggregate([
    {$group: {_id: "$age", count: {$sum: 1}}}
])`
        },
        {
          id: "db-e-2",
          title: "Stored Procedure for Transfer",
          description: "Create a stored procedure that safely transfers funds between accounts.",
          hint: "Use transaction within stored procedure with error handling.",
          solution: `DELIMITER //
CREATE PROCEDURE TransferFunds(
    IN from_account INT,
    IN to_account INT,
    IN amount DECIMAL(10,2)
)
BEGIN
    DECLARE from_balance DECIMAL(10,2);
    
    START TRANSACTION;
    
    SELECT balance INTO from_balance 
    FROM accounts WHERE account_id = from_account FOR UPDATE;
    
    IF from_balance >= amount THEN
        UPDATE accounts SET balance = balance - amount 
        WHERE account_id = from_account;
        
        UPDATE accounts SET balance = balance + amount 
        WHERE account_id = to_account;
        
        COMMIT;
        SELECT 'Transfer successful' AS result;
    ELSE
        ROLLBACK;
        SELECT 'Insufficient funds' AS result;
    END IF;
END //
DELIMITER ;`
        },
        {
          id: "db-e-3",
          title: "Database User with Limited Access",
          description: "Create a user that can only read from students table, not modify it.",
          hint: "Use CREATE USER and GRANT SELECT only.",
          solution: `CREATE USER 'student_viewer'@'localhost' IDENTIFIED BY 'view123';
GRANT SELECT ON school.students TO 'student_viewer'@'localhost';`
        },
        {
          id: "db-e-4",
          title: "Query with Window Function",
          description: "Write a query that ranks students by GPA within their major using window functions.",
          hint: "Use RANK() or ROW_NUMBER() with PARTITION BY.",
          solution: `SELECT 
    name, 
    major,
    GPA,
    RANK() OVER (PARTITION BY major ORDER BY GPA DESC) as rank_in_major
FROM students;`
        },
        {
          id: "db-e-5",
          title: "Backup and Restore Procedure",
          description: "Write commands to backup a database and restore it.",
          hint: "Use mysqldump for backup and mysql for restore.",
          solution: `# Backup command
mysqldump -u username -p school > school_backup.sql

# Restore command
mysql -u username -p school < school_backup.sql`
        }
      ]
    }
  ]
},

  // C# Pathway
{
  id: 7,
  title: "C#",
  icon: "fa-code",
  description: "C# is a programming language mainly used for creating Windows apps, games with Unity, and web services. It is similar to Java in many ways but is especially tied to Microsoft technologies. Learning C# will teach you how to make software that runs on computers and even video games.",
  color: "#0078d7",
  slug: "csharp",
  levels: [
    {
      name: "Beginner",
      slug: "beginner",
      description: "Learn the basics of C#, including variables, data types, control structures, and simple programs.",
      resources: [
        {
          title: "C# Syntax and Basic Structure",
          description: "Understand C# program structure, namespaces, classes, and the Main method.",
          codeSnippet: `using System;

namespace HelloWorld
{
    class Program
    {
        static void Main(string[] args)
        {
            // Basic output
            Console.WriteLine("Hello, World!");
            
            // Variables and data types
            string name = "John";
            int age = 25;
            double height = 5.9;
            bool isStudent = true;
            char grade = 'A';
            
            // String interpolation
            Console.WriteLine($"Name: {name}, Age: {age}");
            
            // Basic input
            Console.Write("Enter your name: ");
            string input = Console.ReadLine();
            Console.WriteLine($"Hello, {input}!");
        }
    }
}`
        },
        {
          title: "Data Types and Type Conversion",
          description: "Work with C# data types and learn how to convert between them.",
          codeSnippet: `// Value types
int number = 42;
double price = 19.99m;
float temperature = 98.6f;
decimal salary = 50000.50m;
bool isActive = true;
char letter = 'X';

// Reference types
string message = "Hello C#";
object anything = "Can hold anything";
int[] numbers = {1, 2, 3, 4, 5};

// Type conversion
string numberString = "123";
int convertedNumber = int.Parse(numberString);
int tryConverted;
bool success = int.TryParse("456", out tryConverted);

// Implicit and explicit conversion
double bigNumber = number;  // Implicit
int smallNumber = (int)bigNumber;  // Explicit cast

// Boxing and unboxing
object boxed = number;  // Boxing
int unboxed = (int)boxed;  // Unboxing

// Nullable types
int? nullableInt = null;
if (nullableInt.HasValue)
{
    Console.WriteLine(nullableInt.Value);
}`
        },
        {
          title: "Control Flow - Conditionals and Loops",
          description: "Use if/else statements, switch, and loops to control program execution.",
          codeSnippet: `// If-else statements
int score = 85;
if (score >= 90)
{
    Console.WriteLine("Grade: A");
}
else if (score >= 80)
{
    Console.WriteLine("Grade: B");
}
else
{
    Console.WriteLine("Grade: C or below");
}

// Switch statement
string day = "Monday";
switch (day)
{
    case "Monday":
        Console.WriteLine("Start of work week");
        break;
    case "Friday":
        Console.WriteLine("Weekend is near!");
        break;
    default:
        Console.WriteLine("Regular day");
        break;
}

// For loop
for (int i = 0; i < 5; i++)
{
    Console.WriteLine($"Count: {i}");
}

// While loop
int counter = 0;
while (counter < 3)
{
    Console.WriteLine($"While count: {counter}");
    counter++;
}

// Do-while loop
int doCounter = 0;
do
{
    Console.WriteLine($"Do-while count: {doCounter}");
    doCounter++;
} while (doCounter < 3);

// Foreach loop
string[] fruits = {"apple", "banana", "orange"};
foreach (string fruit in fruits)
{
    Console.WriteLine(fruit);
}`
        },
        {
          title: "Arrays and Collections",
          description: "Work with arrays and basic collection types in C#.",
          codeSnippet: `// Arrays
int[] numbers = new int[5];  // Fixed size
numbers[0] = 1;
numbers[1] = 2;

int[] initialized = {1, 2, 3, 4, 5};
string[] names = {"Alice", "Bob", "Charlie"};

// Multi-dimensional arrays
int[,] matrix = new int[2, 3];
matrix[0, 0] = 1;
matrix[0, 1] = 2;

// Jagged arrays (array of arrays)
int[][] jagged = new int[3][];
jagged[0] = new int[] {1, 2, 3};
jagged[1] = new int[] {4, 5};

// List<T> - dynamic array
List<string> shoppingList = new List<string>();
shoppingList.Add("Milk");
shoppingList.Add("Bread");
shoppingList.Remove("Milk");
shoppingList.Contains("Bread");  // true

// Dictionary - key-value pairs
Dictionary<string, int> ages = new Dictionary<string, int>();
ages["Alice"] = 25;
ages["Bob"] = 30;
Console.WriteLine(ages["Alice"]);  // 25

// HashSet - unique values
HashSet<int> uniqueNumbers = new HashSet<int> {1, 2, 2, 3};  // {1, 2, 3}`
        },
        {
          title: "Methods and Basic Error Handling",
          description: "Create methods and handle basic exceptions in C#.",
          codeSnippet: `// Basic method
public static int Add(int a, int b)
{
    return a + b;
}

// Method with optional parameters
public static void Greet(string name, string greeting = "Hello")
{
    Console.WriteLine($"{greeting}, {name}!");
}

// Method with out parameter
public static bool TryDivide(int a, int b, out double result)
{
    if (b == 0)
    {
        result = 0;
        return false;
    }
    result = (double)a / b;
    return true;
}

// Using methods
int sum = Add(5, 3);
Greet("Alice");
Greet("Bob", "Hi");

if (TryDivide(10, 3, out double divisionResult))
{
    Console.WriteLine($"Result: {divisionResult}");
}

// Basic exception handling
try
{
    int zero = 0;
    int result = 10 / zero;
}
catch (DivideByZeroException ex)
{
    Console.WriteLine($"Error: {ex.Message}");
}
catch (Exception ex)
{
    Console.WriteLine($"General error: {ex.Message}");
}
finally
{
    Console.WriteLine("This always executes");
}`
        }
      ],
      challenges: [
        {
          id: "cs-b-1",
          title: "Hello World with Input",
          description: "Create a program that asks for user's name and greets them.",
          hint: "Use Console.ReadLine() for input and string interpolation for output.",
          solution: `Console.Write("Enter your name: ");
string name = Console.ReadLine();
Console.WriteLine($"Hello, {name}!");`
        },
        {
          id: "cs-b-2",
          title: "Simple Calculator Method",
          description: "Create a method that takes two numbers and returns their sum and product.",
          hint: "Use a method with multiple return values or out parameters.",
          solution: `public static (int sum, int product) Calculate(int a, int b)
{
    return (a + b, a * b);
}

var result = Calculate(5, 3);
Console.WriteLine($"Sum: {result.sum}, Product: {result.product}");`
        },
        {
          id: "cs-b-3",
          title: "Array Sum",
          description: "Create a method that calculates the sum of all elements in an integer array.",
          hint: "Use a foreach loop to iterate through the array.",
          solution: `public static int SumArray(int[] numbers)
{
    int sum = 0;
    foreach (int num in numbers)
    {
        sum += num;
    }
    return sum;
}

int[] nums = {1, 2, 3, 4, 5};
Console.WriteLine(SumArray(nums));  // 15`
        },
        {
          id: "cs-b-4",
          title: "FizzBuzz",
          description: "Print numbers 1-100, but for multiples of 3 print 'Fizz', multiples of 5 print 'Buzz', and multiples of both print 'FizzBuzz'.",
          hint: "Use modulo operator % and if-else conditions.",
          solution: `for (int i = 1; i <= 100; i++)
{
    if (i % 3 == 0 && i % 5 == 0)
        Console.WriteLine("FizzBuzz");
    else if (i % 3 == 0)
        Console.WriteLine("Fizz");
    else if (i % 5 == 0)
        Console.WriteLine("Buzz");
    else
        Console.WriteLine(i);
}`
        },
        {
          id: "cs-b-5",
          title: "Safe Number Parsing",
          description: "Write code that safely converts a string to int and handles invalid input.",
          hint: "Use int.TryParse() method.",
          solution: `string input = "123";
if (int.TryParse(input, out int number))
{
    Console.WriteLine($"Parsed number: {number}");
}
else
{
    Console.WriteLine("Invalid number format");
}`
        }
      ]
    },
    {
      name: "Intermediate",
      slug: "intermediate",
      description: "Learn Object-Oriented Programming, LINQ, delegates, and advanced C# features.",
      resources: [
        {
          title: "Object-Oriented Programming in C#",
          description: "Create classes, objects, and understand OOP principles in C#.",
          codeSnippet: `// Basic class
public class Person
{
    // Fields
    private string name;
    private int age;
    
    // Properties
    public string Name
    {
        get { return name; }
        set { name = value; }
    }
    
    // Auto-implemented property
    public int Age { get; set; }
    
    // Constructor
    public Person(string name, int age)
    {
        this.name = name;
        Age = age;
    }
    
    // Method
    public virtual void Introduce()
    {
        Console.WriteLine($"Hi, I'm {Name} and I'm {Age} years old");
    }
}

// Inheritance
public class Student : Person
{
    public string Major { get; set; }
    
    public Student(string name, int age, string major) : base(name, age)
    {
        Major = major;
    }
    
    // Method overriding
    public override void Introduce()
    {
        Console.WriteLine($"I'm {Name}, a {Major} student");
    }
}

// Using classes
Person person = new Person("Alice", 25);
person.Introduce();

Student student = new Student("Bob", 20, "Computer Science");
student.Introduce();

// Abstract class
public abstract class Shape
{
    public abstract double Area();
}

public class Circle : Shape
{
    public double Radius { get; set; }
    
    public override double Area()
    {
        return Math.PI * Radius * Radius;
    }
}`
        },
        {
          title: "Interfaces and Polymorphism",
          description: "Use interfaces to define contracts and achieve polymorphism.",
          codeSnippet: `// Interface definition
public interface ILogger
{
    void Log(string message);
    void LogError(string error);
}

public interface IDatabase
{
    void Save(string data);
    string Load();
}

// Implementing interfaces
public class FileLogger : ILogger
{
    public void Log(string message)
    {
        File.AppendAllText("log.txt", $"{DateTime.Now}: {message}\\n");
    }
    
    public void LogError(string error)
    {
        Log($"ERROR: {error}");
    }
}

public class ConsoleLogger : ILogger
{
    public void Log(string message)
    {
        Console.WriteLine($"[INFO] {message}");
    }
    
    public void LogError(string error)
    {
        Console.WriteLine($"[ERROR] {error}");
    }
}

// Class implementing multiple interfaces
public class DataService : ILogger, IDatabase
{
    private readonly ILogger logger;
    
    public DataService(ILogger logger)
    {
        this.logger = logger;
    }
    
    public void Log(string message) => logger.Log(message);
    public void LogError(string error) => logger.LogError(error);
    
    public void Save(string data)
    {
        Log("Saving data...");
        // Save implementation
    }
    
    public string Load()
    {
        Log("Loading data...");
        return "Loaded data";
    }
}

// Using interfaces for polymorphism
ILogger logger = new FileLogger();
logger.Log("Application started");

logger = new ConsoleLogger();
logger.Log("This goes to console");`
        },
        {
          title: "LINQ (Language Integrated Query)",
          description: "Use LINQ to query collections and data sources in a declarative way.",
          codeSnippet: `// Sample data
List<Person> people = new List<Person>
{
    new Person("Alice", 25),
    new Person("Bob", 30),
    new Person("Charlie", 35),
    new Person("Diana", 28),
    new Person("Eve", 32)
};

// LINQ query syntax
var youngPeople = from person in people
                  where person.Age < 30
                  orderby person.Name
                  select person;

// LINQ method syntax
var oldPeople = people
    .Where(p => p.Age > 30)
    .OrderByDescending(p => p.Age)
    .Select(p => new { p.Name, p.Age });

// Aggregation
int totalAge = people.Sum(p => p.Age);
double averageAge = people.Average(p => p.Age);
Person oldest = people.MaxBy(p => p.Age);

// Grouping
var ageGroups = people
    .GroupBy(p => p.Age / 10 * 10)  // Group by decade
    .Select(g => new { 
        Decade = $"{g.Key}s", 
        Count = g.Count(),
        People = g.ToList() 
    });

// Joining collections
List<Course> courses = new List<Course>
{
    new Course("C# Programming", "Alice"),
    new Course("Web Development", "Bob")
};

var joined = from person in people
             join course in courses on person.Name equals course.Instructor
             select new { person.Name, Course = course.Title };

// Deferred execution
var query = people.Where(p => p.Age > 25);  // Query not executed yet
var results = query.ToList();  // Query executed here`
        },
        {
          title: "Delegates, Events, and Lambda Expressions",
          description: "Use delegates for callback mechanisms and events for pub/sub patterns.",
          codeSnippet: `// Delegate types
public delegate void MessageHandler(string message);
public delegate int MathOperation(int a, int b);

// Using delegates
public class Calculator
{
    public static int Add(int a, int b) => a + b;
    public static int Multiply(int a, int b) => a * b;
}

MathOperation operation = Calculator.Add;
int result = operation(5, 3);  // 8
operation = Calculator.Multiply;
result = operation(5, 3);  // 15

// Func and Action delegates (built-in)
Func<int, int, int> addFunc = (a, b) => a + b;
Action<string> printAction = message => Console.WriteLine(message);

// Events
public class Button
{
    public event EventHandler Clicked;
    
    public void Click()
    {
        Clicked?.Invoke(this, EventArgs.Empty);
    }
}

public class Form
{
    public Form()
    {
        Button button = new Button();
        button.Clicked += OnButtonClicked;
    }
    
    private void OnButtonClicked(object sender, EventArgs e)
    {
        Console.WriteLine("Button was clicked!");
    }
}

// Lambda expressions
List<int> numbers = new List<int> {1, 2, 3, 4, 5};
var evenNumbers = numbers.Where(n => n % 2 == 0);
var squared = numbers.Select(n => n * n);`
        },
        {
          title: "Exception Handling and Custom Exceptions",
          description: "Create robust error handling and custom exception types.",
          codeSnippet: `// Custom exception
public class InvalidAgeException : Exception
{
    public int InvalidAge { get; }
    
    public InvalidAgeException(string message, int invalidAge) : base(message)
    {
        InvalidAge = invalidAge;
    }
}

// Exception handling patterns
public class AgeValidator
{
    public static void ValidateAge(int age)
    {
        if (age < 0 || age > 150)
        {
            throw new InvalidAgeException("Age must be between 0 and 150", age);
        }
    }
}

// Comprehensive exception handling
try
{
    Console.Write("Enter age: ");
    int age = int.Parse(Console.ReadLine());
    AgeValidator.ValidateAge(age);
    Console.WriteLine($"Valid age: {age}");
}
catch (FormatException)
{
    Console.WriteLine("Please enter a valid number");
}
catch (InvalidAgeException ex)
{
    Console.WriteLine($"Invalid age: {ex.InvalidAge}. {ex.Message}");
}
catch (Exception ex)
{
    Console.WriteLine($"Unexpected error: {ex.Message}");
    // Log the exception
    // throw;  // Re-throw if needed
}
finally
{
    Console.WriteLine("Validation completed");
}

// Exception filters (C# 6+)
try
{
    // Some operation
}
catch (Exception ex) when (ex.Message.Contains("network"))
{
    Console.WriteLine("Network-related error");
}
catch (Exception ex) when (ex.Message.Contains("database"))
{
    Console.WriteLine("Database-related error");
}`
        }
      ],
      challenges: [
        {
          id: "cs-i-1",
          title: "Bank Account Class",
          description: "Create a BankAccount class with deposit, withdraw, and balance properties.",
          hint: "Use properties with private set and methods for operations.",
          solution: `public class BankAccount
{
    public string AccountNumber { get; }
    public decimal Balance { get; private set; }
    
    public BankAccount(string accountNumber, decimal initialBalance = 0)
    {
        AccountNumber = accountNumber;
        Balance = initialBalance;
    }
    
    public void Deposit(decimal amount)
    {
        if (amount <= 0) throw new ArgumentException("Amount must be positive");
        Balance += amount;
    }
    
    public bool Withdraw(decimal amount)
    {
        if (amount <= 0) throw new ArgumentException("Amount must be positive");
        if (amount > Balance) return false;
        
        Balance -= amount;
        return true;
    }
}`
        },
        {
          id: "cs-i-2",
          title: "LINQ Query",
          description: "Use LINQ to find all people over 30 and order them by name.",
          hint: "Use Where and OrderBy methods with lambda expressions.",
          solution: `var result = people
    .Where(p => p.Age > 30)
    .OrderBy(p => p.Name)
    .ToList();`
        },
        {
          id: "cs-i-3",
          title: "Custom Exception",
          description: "Create a custom NegativeBalanceException for bank account operations.",
          hint: "Inherit from Exception and add relevant properties.",
          solution: `public class NegativeBalanceException : Exception
{
    public decimal CurrentBalance { get; }
    
    public NegativeBalanceException(decimal balance) 
        : base($"Account balance cannot be negative. Current: {balance}")
    {
        CurrentBalance = balance;
    }
}`
        },
        {
          id: "cs-i-4",
          title: "Event Handler",
          description: "Create a class that raises an event when a threshold value is exceeded.",
          hint: "Use event keyword and EventHandler delegate.",
          solution: `public class Sensor
{
    public event EventHandler<int> ThresholdExceeded;
    private int threshold;
    
    public Sensor(int threshold) => this.threshold = threshold;
    
    public void UpdateValue(int value)
    {
        if (value > threshold)
            ThresholdExceeded?.Invoke(this, value);
    }
}`
        },
        {
          id: "cs-i-5",
          title: "Interface Implementation",
          description: "Create an IShape interface with Area method and implement it in Circle and Rectangle classes.",
          hint: "Define interface with method signature and implement in classes.",
          solution: `public interface IShape
{
    double Area();
}

public class Circle : IShape
{
    public double Radius { get; set; }
    public double Area() => Math.PI * Radius * Radius;
}

public class Rectangle : IShape
{
    public double Width { get; set; }
    public double Height { get; set; }
    public double Area() => Width * Height;
}`
        }
      ]
    },
    {
      name: "Expert",
      slug: "expert",
      description: "Master advanced C# concepts including async/await, attributes, reflection, and performance optimization.",
      resources: [
        {
          title: "Asynchronous Programming with Async/Await",
          description: "Use async/await for non-blocking operations and better resource utilization.",
          codeSnippet: `// Basic async method
public async Task<string> DownloadDataAsync(string url)
{
    using (HttpClient client = new HttpClient())
    {
        return await client.GetStringAsync(url);
    }
}

// Async method with error handling
public async Task<bool> TryDownloadAsync(string url)
{
    try
    {
        string data = await DownloadDataAsync(url);
        Console.WriteLine($"Downloaded {data.Length} characters");
        return true;
    }
    catch (HttpRequestException ex)
    {
        Console.WriteLine($"Download failed: {ex.Message}");
        return false;
    }
}

// Multiple async operations
public async Task ProcessMultipleUrlsAsync(string[] urls)
{
    var downloadTasks = urls.Select(url => DownloadDataAsync(url));
    string[] results = await Task.WhenAll(downloadTasks);
    
    foreach (string result in results)
    {
        Console.WriteLine($"Result length: {result.Length}");
    }
}

// Async streams (C# 8+)
public async IAsyncEnumerable<int> GenerateSequenceAsync()
{
    for (int i = 0; i < 10; i++)
    {
        await Task.Delay(100);  // Simulate async work
        yield return i;
    }
}

// Using async streams
await foreach (var number in GenerateSequenceAsync())
{
    Console.WriteLine(number);
}

// ValueTask for performance
public async ValueTask<int> CachedCalculationAsync()
{
    if (cachedValue.HasValue)
        return cachedValue.Value;
    
    cachedValue = await ExpensiveCalculationAsync();
    return cachedValue.Value;
}`
        },
        {
          title: "Attributes and Reflection",
          description: "Use attributes for metadata and reflection for runtime type inspection.",
          codeSnippet: `// Custom attribute
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class AuthorAttribute : Attribute
{
    public string Name { get; }
    public string Version { get; set; }
    
    public AuthorAttribute(string name)
    {
        Name = name;
    }
}

// Using attributes
[Author("John Doe", Version = "1.0")]
[Serializable]
public class Calculator
{
    [Author("Jane Smith")]
    [Obsolete("Use new Calculate method instead")]
    public int OldCalculate(int a, int b)
    {
        return a + b;
    }
}

// Reflection
Type calculatorType = typeof(Calculator);

// Get type information
Console.WriteLine($"Type: {calculatorType.Name}");
Console.WriteLine($"Methods: {string.Join(", ", calculatorType.GetMethods().Select(m => m.Name))}");

// Get custom attributes
var authorAttributes = calculatorType.GetCustomAttributes(typeof(AuthorAttribute), false);
foreach (AuthorAttribute attr in authorAttributes)
{
    Console.WriteLine($"Author: {attr.Name}, Version: {attr.Version}");
}

// Dynamic type creation
Type dynamicType = Assembly.GetExecutingAssembly().GetType("MyNamespace.MyClass");
object instance = Activator.CreateInstance(dynamicType);

// Method invocation via reflection
MethodInfo method = calculatorType.GetMethod("OldCalculate");
int result = (int)method.Invoke(instance, new object[] {5, 3});`
        },
        {
          title: "Advanced LINQ and Expression Trees",
          description: "Use advanced LINQ features and expression trees for dynamic queries.",
          codeSnippet: `// Expression trees
Expression<Func<int, bool>> isEvenExpression = num => num % 2 == 0;

// Compile expression to delegate
Func<int, bool> isEven = isEvenExpression.Compile();
Console.WriteLine(isEven(4));  // True

// Building expressions dynamically
ParameterExpression param = Expression.Parameter(typeof(int), "x");
ConstantExpression constant = Expression.Constant(2, typeof(int));
BinaryExpression modulus = Expression.Modulo(param, constant);
BinaryExpression equals = Expression.Equal(modulus, Expression.Constant(0, typeof(int)));

Expression<Func<int, bool>> dynamicIsEven = 
    Expression.Lambda<Func<int, bool>>(equals, param);

Func<int, bool> dynamicDelegate = dynamicIsEven.Compile();
Console.WriteLine(dynamicDelegate(4));  // True

// Advanced LINQ - partitioning
var firstThree = people.Take(3);
var skipTwo = people.Skip(2);
var page = people.Skip(10).Take(5);  // Pagination

// Set operations
var distinctAges = people.Select(p => p.Age).Distinct();
var union = people.Union(otherPeople);
var intersect = people.Intersect(commonPeople);
var except = people.Except(removedPeople);

// Quantifiers
bool allAdults = people.All(p => p.Age >= 18);
bool anySeniors = people.Any(p => p.Age >= 65);
bool containsBob = people.Any(p => p.Name == "Bob");`
        },
        {
          title: "Dependency Injection and IoC Containers",
          description: "Implement dependency injection and use IoC containers for loose coupling.",
          codeSnippet: `// Service interfaces
public interface IEmailService
{
    Task SendEmailAsync(string to, string subject, string body);
}

public interface IUserRepository
{
    Task<User> GetUserAsync(int id);
    Task SaveUserAsync(User user);
}

// Service implementations
public class SmtpEmailService : IEmailService
{
    public async Task SendEmailAsync(string to, string subject, string body)
    {
        // SMTP implementation
        await Task.Delay(100);
        Console.WriteLine($"Email sent to {to}");
    }
}

public class SqlUserRepository : IUserRepository
{
    public async Task<User> GetUserAsync(int id)
    {
        await Task.Delay(50);
        return new User { Id = id, Name = "Test User" };
    }
    
    public async Task SaveUserAsync(User user)
    {
        await Task.Delay(50);
        Console.WriteLine($"User {user.Name} saved");
    }
}

// Service that uses dependencies
public class UserService
{
    private readonly IUserRepository userRepository;
    private readonly IEmailService emailService;
    
    public UserService(IUserRepository userRepository, IEmailService emailService)
    {
        this.userRepository = userRepository;
        this.emailService = emailService;
    }
    
    public async Task RegisterUserAsync(string name, string email)
    {
        var user = new User { Name = name, Email = email };
        await userRepository.SaveUserAsync(user);
        await emailService.SendEmailAsync(email, "Welcome", "Welcome to our service!");
    }
}

// Using Microsoft.Extensions.DependencyInjection
var services = new ServiceCollection();
services.AddTransient<IEmailService, SmtpEmailService>();
services.AddScoped<IUserRepository, SqlUserRepository>();
services.AddTransient<UserService>();

var serviceProvider = services.BuildServiceProvider();
using var scope = serviceProvider.CreateScope();

var userService = scope.ServiceProvider.GetRequiredService<UserService>();
await userService.RegisterUserAsync("Alice", "alice@example.com");`
        },
        {
          title: "Performance Optimization and Memory Management",
          description: "Use advanced techniques for performance optimization and efficient memory usage.",
          codeSnippet: `// Span<T> for performance
public static int SumArray(ReadOnlySpan<int> numbers)
{
    int sum = 0;
    foreach (int num in numbers)
    {
        sum += num;
    }
    return sum;
}

// Using Span
int[] array = {1, 2, 3, 4, 5};
Span<int> span = array;
int result = SumArray(span);

// Memory pools for reducing GC pressure
using var pool = MemoryPool<int>.Shared;
using var owner = pool.Rent(100);
Memory<int> memory = owner.Memory;

// ArrayPool for reusable arrays
var arrayPool = ArrayPool<int>.Shared;
int[] rentedArray = arrayPool.Rent(1000);
try
{
    // Use the array
    for (int i = 0; i < 1000; i++)
    {
        rentedArray[i] = i;
    }
}
finally
{
    arrayPool.Return(rentedArray);
}

// Struct for stack allocation
public readonly struct Point
{
    public double X { get; }
    public double Y { get; }
    
    public Point(double x, double y) => (X, Y) = (x, y);
}

// Pattern matching (C# 7+)
public static double CalculateArea(object shape)
{
    return shape switch
    {
        Circle c => Math.PI * c.Radius * c.Radius,
        Rectangle r => r.Width * r.Height,
        Triangle t => 0.5 * t.Base * t.Height,
        _ => throw new ArgumentException("Unknown shape")
    };
}

// Records for immutable data (C# 9+)
public record PersonRecord(string Name, int Age);
public record StudentRecord(string Name, int Age, string Major) : PersonRecord(Name, Age);`
        }
      ],
      challenges: [
        {
          id: "cs-e-1",
          title: "Async Data Processor",
          description: "Create a method that processes multiple URLs asynchronously and returns combined results.",
          hint: "Use Task.WhenAll with multiple async operations.",
          solution: `public async Task<string[]> ProcessUrlsAsync(string[] urls)
{
    var tasks = urls.Select(async url =>
    {
        using var client = new HttpClient();
        return await client.GetStringAsync(url);
    });
    
    return await Task.WhenAll(tasks);
}`
        },
        {
          id: "cs-e-2",
          title: "Custom Attribute with Reflection",
          description: "Create a custom attribute for logging and use reflection to find all methods with this attribute.",
          hint: "Create attribute class and use GetCustomAttributes in reflection.",
          solution: `[AttributeUsage(AttributeTargets.Method)]
public class LogAttribute : Attribute { }

public class Service
{
    [Log]
    public void SensitiveOperation() { }
}

// Find methods with LogAttribute
var methods = typeof(Service)
    .GetMethods()
    .Where(m => m.GetCustomAttribute<LogAttribute>() != null);`
        },
        {
          id: "cs-e-3",
          title: "Dependency Injection Setup",
          description: "Set up dependency injection for a service that uses repository and logging dependencies.",
          hint: "Use ServiceCollection to register interfaces and implementations.",
          solution: `var services = new ServiceCollection();
services.AddScoped<IUserRepository, UserRepository>();
services.AddScoped<ILogger, FileLogger>();
services.AddScoped<UserService>();

var provider = services.BuildServiceProvider();
var userService = provider.GetService<UserService>();`
        },
        {
          id: "cs-e-4",
          title: "Pattern Matching",
          description: "Use pattern matching to handle different shape types in a single method.",
          hint: "Use switch expression with type patterns.",
          solution: `public double CalculateArea(object shape) => shape switch
{
    Circle c => Math.PI * c.Radius * c.Radius,
    Rectangle r => r.Width * r.Height,
    _ => throw new ArgumentException("Unknown shape")
};`
        },
        {
          id: "cs-e-5",
          title: "Memory-Efficient Array Processing",
          description: "Use Span<T> to process large arrays without creating copies.",
          hint: "Use Span<T> for stack allocation and efficient slicing.",
          solution: `public static void ProcessSpan(Span<int> data)
{
    for (int i = 0; i < data.Length; i++)
    {
        data[i] *= 2;
    }
}

int[] largeArray = new int[1000];
ProcessSpan(largeArray);`
        }
      ]
    }
  ]
}
];
