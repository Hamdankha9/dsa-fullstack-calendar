export const PATTERNS = {
  "Two Pointers": {
    title: "Two Pointers Pattern",
    description: "The Two Pointers pattern involves using two pointers (or indices) to iterate through an array or list. It's heavily used for searching pairs in a sorted array or linked list.",
    howItWorks: [
      "Pointer 1 starts at the beginning (index 0).",
      "Pointer 2 starts at the end (index array.length - 1).",
      "Depending on the sum/condition, you either move Pointer 1 to the right (to increase sum) or Pointer 2 to the left (to decrease sum).",
      "They meet in the middle, running in O(N) time."
    ],
    codeSnippet: `function twoSum(numbers, target) {
  let left = 0, right = numbers.length - 1;
  while (left < right) {
    const sum = numbers[left] + numbers[right];
    if (sum === target) return [left + 1, right + 1];
    else if (sum < target) left++;
    else right--;
  }
  return [];
}`,
    visType: "two-pointers"
  },
  "Sliding Window": {
    title: "Sliding Window Pattern",
    description: "The Sliding Window pattern is used to perform required operations on a specific window size of a given array or linked list. It is highly effective for 'longest/shortest subarray/substring' problems.",
    howItWorks: [
      "Maintain a window defined by 'left' and 'right' pointers.",
      "Expand the window by moving 'right' and adding elements to your current state.",
      "If the window violates the condition (e.g. sum is too large), shrink it by moving 'left' until it becomes valid again.",
      "Keep track of the max/min metric (like length) at each valid state."
    ],
    codeSnippet: `function maxSubArrayLen(nums, k) {
  let maxLen = 0, sum = 0, left = 0;
  for (let right = 0; right < nums.length; right++) {
    sum += nums[right];
    while (sum > k) {
      sum -= nums[left++];
    }
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}`,
    visType: "sliding-window"
  },
  "Binary Search": {
    title: "Binary Search Pattern",
    description: "Binary search is an efficient algorithm for finding an item from a sorted list of items. It works by repeatedly dividing in half the portion of the list that could contain the item.",
    howItWorks: [
      "Initialize 'left' = 0 and 'right' = array.length - 1.",
      "Find the 'mid' point.",
      "If array[mid] == target, return mid.",
      "If array[mid] < target, search the right half by setting left = mid + 1.",
      "If array[mid] > target, search the left half by setting right = mid - 1."
    ],
    codeSnippet: `function search(nums, target) {
  let left = 0, right = nums.length - 1;
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;
    else if (nums[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`,
    visType: "binary-search"
  },
  "Dynamic Programming": {
    title: "Dynamic Programming (DP)",
    description: "DP is an optimization technique that solves complex problems by breaking them down into simpler subproblems and storing their results (memoization/tabulation) so that we don't re-compute them.",
    howItWorks: [
      "Define the state: What does dp[i] represent? (e.g., max profit up to day i)",
      "Find the recurrence relation: How does dp[i] relate to dp[i-1] or dp[i-2]?",
      "Set the base cases: What is dp[0] or dp[1]?",
      "Iterate to compute the answer up to dp[n]."
    ],
    codeSnippet: `function climbStairs(n) {
  if (n <= 2) return n;
  let dp = [0, 1, 2];
  for (let i = 3; i <= n; i++) {
    dp[i] = dp[i-1] + dp[i-2];
  }
  return dp[n];
}`,
    visType: "dp"
  },
  "Hashing": {
    title: "Hashing / Hash Map",
    description: "Using Hash Maps or Hash Sets to store previously seen items for O(1) lookups. This pattern fundamentally trades space complexity (O(N) memory) to improve time complexity to O(N).",
    howItWorks: [
      "Initialize an empty Hash Map or Set.",
      "Iterate through the array.",
      "Calculate what you are 'looking for' (e.g. target - current_number).",
      "Check if it exists in the Map. If yes, you found your answer! If not, add the current element to the Map."
    ],
    codeSnippet: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (map.has(diff)) return [map.get(diff), i];
    map.set(nums[i], i);
  }
}`,
    visType: "hashing"
  },
  "Stack": {
    title: "Monotonic Stack",
    description: "A stack where elements are always sorted (either entirely increasing or entirely decreasing). Extremely useful for 'Next Greater Element' or 'Previous Smaller Element' problems.",
    howItWorks: [
      "Iterate through the array.",
      "While the stack is not empty AND the current element breaks the monotonic rule (e.g. is greater than the stack's top element), pop the stack.",
      "The popped element has found its 'Next Greater Element' (the current element).",
      "Push the current element onto the stack."
    ],
    codeSnippet: `function nextGreaterElement(nums) {
  let res = new Array(nums.length).fill(-1);
  let stack = [];
  for (let i = 0; i < nums.length; i++) {
    while (stack.length && nums[stack[stack.length - 1]] < nums[i]) {
      res[stack.pop()] = nums[i];
    }
    stack.push(i);
  }
  return res;
}`,
    visType: "stack"
  },
  "Linked List": {
    title: "Fast & Slow Pointers (Linked List)",
    description: "Also known as Floyd's Cycle Detection Algorithm. It uses two pointers moving at different speeds to detect cycles or find the middle of a linked list.",
    howItWorks: [
      "Initialize a 'slow' pointer and a 'fast' pointer, both at the head.",
      "Move 'slow' by 1 step, and 'fast' by 2 steps.",
      "If 'fast' reaches null, there is no cycle.",
      "If 'slow' ever equals 'fast', they have collided, meaning a cycle exists."
    ],
    codeSnippet: `function hasCycle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}`,
    visType: "linked-list"
  },
  "Backtracking": {
    title: "Backtracking",
    description: "A recursive strategy for finding all (or some) solutions to computational problems by incrementally building candidates to the solutions, and abandoning a candidate ('backtracking') as soon as it determines that the candidate cannot possibly be completed.",
    howItWorks: [
      "Create a recursive helper function.",
      "Base Case: If the current combination is valid/complete, add it to the results.",
      "Iterate through all possible choices at the current step.",
      "Make a choice, recurse, then undo the choice (backtrack) to explore other paths."
    ],
    codeSnippet: `function subsets(nums) {
  const res = [];
  function backtrack(start, path) {
    res.push([...path]);
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);       // Make choice
      backtrack(i + 1, path);   // Recurse
      path.pop();               // Undo choice
    }
  }
  backtrack(0, []);
  return res;
}`,
    visType: "backtracking"
  },
  "Tree DFS": {
    title: "Tree Depth-First Search (DFS)",
    description: "A technique to traverse a tree by exploring as far as possible along each branch before backtracking. Often implemented using recursion.",
    howItWorks: [
      "Base case: If node is null, return 0 or null.",
      "Recursively call DFS on the left child.",
      "Recursively call DFS on the right child.",
      "Process the current node and return the aggregated result."
    ],
    codeSnippet: `function maxDepth(root) {
  if (!root) return 0;
  const left = maxDepth(root.left);
  const right = maxDepth(root.right);
  return Math.max(left, right) + 1;
}`,
    visType: "tree-dfs"
  },
  "Tree BFS": {
    title: "Tree Breadth-First Search (BFS)",
    description: "Also known as Level-Order Traversal. It traverses the tree level by level, from top to bottom, left to right. It is always implemented using a Queue.",
    howItWorks: [
      "Initialize a queue and push the root node into it.",
      "While the queue is not empty, calculate its current length (number of nodes in the current level).",
      "Loop 'length' times: shift a node from the queue, process it, and push its left and right children into the queue.",
      "Repeat until queue is empty."
    ],
    codeSnippet: `function levelOrder(root) {
  if (!root) return [];
  const res = [], q = [root];
  while (q.length) {
    const levelSize = q.length;
    const currentLevel = [];
    for (let i = 0; i < levelSize; i++) {
      const node = q.shift();
      currentLevel.push(node.val);
      if (node.left) q.push(node.left);
      if (node.right) q.push(node.right);
    }
    res.push(currentLevel);
  }
  return res;
}`,
    visType: "tree-bfs"
  },
  "Graph": {
    title: "Graph Traversal (BFS / DFS)",
    description: "Graphs can be traversed using BFS (Queue) for finding shortest paths, or DFS (Recursion/Stack) for exploring deep connectivity. You must track 'visited' nodes to avoid infinite loops in graphs with cycles.",
    howItWorks: [
      "Build an adjacency list from the given edges.",
      "Initialize a 'visited' set to keep track of nodes you have already seen.",
      "Start from a node, mark it as visited.",
      "Iterate over its neighbors. If a neighbor is not visited, recursively call DFS (or add to BFS queue)."
    ],
    codeSnippet: `function validPath(n, edges, source, destination) {
  const adj = Array.from({length: n}, () => []);
  for (let [u, v] of edges) { adj[u].push(v); adj[v].push(u); }
  
  const visited = new Set([source]);
  function dfs(node) {
    if (node === destination) return true;
    for (let neighbor of adj[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        if (dfs(neighbor)) return true;
      }
    }
    return false;
  }
  return dfs(source);
}`,
    visType: "graph"
  },
  "Greedy": {
    title: "Greedy Algorithms",
    description: "Greedy algorithms make the locally optimal choice at each stage with the hope of finding a global optimum. They don't reconsider past choices. Often requires sorting the input first.",
    howItWorks: [
      "Sort the array based on a specific criteria (e.g. by end time, by weight, etc).",
      "Iterate through the array.",
      "Make the best choice at the current moment without worrying about the future.",
      "Accumulate the results."
    ],
    codeSnippet: `function maxProfit(prices) {
  // Greedy approach to Stock market
  let profit = 0;
  for (let i = 1; i < prices.length; i++) {
    if (prices[i] > prices[i-1]) {
      profit += prices[i] - prices[i-1];
    }
  }
  return profit;
}`,
    visType: "greedy"
  },
  "Heap": {
    title: "Heap / Priority Queue",
    description: "A tree-based data structure that maintains the minimum (or maximum) element at the root. Extremely useful for 'Top K' elements, finding medians, or scheduling tasks.",
    howItWorks: [
      "Create a Min-Heap (or Max-Heap).",
      "Iterate through the elements and push them into the heap.",
      "If the heap size exceeds K, pop the root element.",
      "By the end, the heap contains only the Top K largest/smallest elements."
    ],
    codeSnippet: `// Using a conceptual MinPriorityQueue
function findKthLargest(nums, k) {
  const minHeap = new MinPriorityQueue();
  for (let num of nums) {
    minHeap.enqueue(num);
    if (minHeap.size() > k) {
      minHeap.dequeue();
    }
  }
  return minHeap.front().element;
}`,
    visType: "heap"
  },
  "Trie": {
    title: "Trie (Prefix Tree)",
    description: "A tree-like data structure that proves to be highly efficient for solving string-related problems, especially prefix matching and autocomplete.",
    howItWorks: [
      "Create a TrieNode class containing a hash map of 'children' and a boolean 'isEndOfWord'.",
      "To insert: Iterate through characters of the word, creating new nodes if children don't exist.",
      "Mark the final node as isEndOfWord = true.",
      "To search: Iterate through characters. If a child doesn't exist, return false."
    ],
    codeSnippet: `class TrieNode {
  constructor() { this.children = {}; this.isEnd = false; }
}
class Trie {
  constructor() { this.root = new TrieNode(); }
  insert(word) {
    let node = this.root;
    for (let char of word) {
      if (!node.children[char]) node.children[char] = new TrieNode();
      node = node.children[char];
    }
    node.isEnd = true;
  }
}`,
    visType: "trie"
  },
  "Recursion": {
    title: "Recursion + Divide & Conquer",
    description: "Divide & Conquer breaks a problem into smaller subproblems, solves each recursively, and combines the results. Merge Sort is the classic example — split the array in half, sort each half, and merge them back together.",
    howItWorks: [
      "Define the base case: the simplest version of the problem (e.g. array of length 0 or 1).",
      "Divide the problem into two (or more) smaller subproblems.",
      "Conquer each subproblem by calling the function recursively.",
      "Combine the results of the subproblems into the final answer."
    ],
    codeSnippet: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}
function merge(l, r) {
  let res = [], i = 0, j = 0;
  while (i < l.length && j < r.length)
    res.push(l[i] < r[j] ? l[i++] : r[j++]);
  return [...res, ...l.slice(i), ...r.slice(j)];
}`,
    visType: "recursion"
  },
  "Bit Manipulation": {
    title: "Bit Manipulation",
    description: "Bit manipulation uses bitwise operators (AND, OR, XOR, NOT, shifts) to solve problems at the binary level. XOR is especially powerful: A ^ A = 0, A ^ 0 = A. This lets you find a unique element in O(n) time with O(1) space.",
    howItWorks: [
      "Understand core operators: & (AND), | (OR), ^ (XOR), ~ (NOT), << (left shift), >> (right shift).",
      "XOR trick: XOR-ing all elements cancels out duplicates since A ^ A = 0.",
      "Use masks to isolate, set, or clear specific bits.",
      "Check power of 2: n & (n-1) === 0."
    ],
    codeSnippet: `function singleNumber(nums) {
  let result = 0;
  for (let num of nums) {
    result ^= num; // XOR cancels duplicates
  }
  return result;
}
// Example: [4, 1, 2, 1, 2]
// 4^1^2^1^2 = 4^(1^1)^(2^2) = 4^0^0 = 4`,
    visType: "bit-manipulation"
  },
  "BST": {
    title: "Binary Search Tree (BST) Patterns",
    description: "A BST is a binary tree where left child < root < right child. This property makes in-order traversal produce a sorted sequence, and enables O(log n) search, insert, and delete on balanced trees.",
    howItWorks: [
      "In-order traversal (Left → Root → Right) visits nodes in sorted ascending order.",
      "To validate a BST: ensure every node is within a valid (min, max) range.",
      "To find Kth smallest: perform in-order traversal and count nodes.",
      "LCA of BST: if both values < node, go left. If both > node, go right. Otherwise, current node is LCA."
    ],
    codeSnippet: `function isValidBST(root, min = -Infinity, max = Infinity) {
  if (!root) return true;
  if (root.val <= min || root.val >= max) return false;
  return isValidBST(root.left, min, root.val)
      && isValidBST(root.right, root.val, max);
}`,
    visType: "bst"
  },
  "Union-Find": {
    title: "Union-Find (Disjoint Set Union)",
    description: "Union-Find tracks a collection of disjoint sets and supports two operations: Find (which set an element belongs to) and Union (merge two sets). With path compression and union by rank, both operations run in nearly O(1) amortized time.",
    howItWorks: [
      "Initialize: each element is its own parent (self-loop).",
      "Find(x): follow parent pointers until you reach the root. Apply path compression (point directly to root).",
      "Union(x, y): find roots of both elements. Attach the smaller tree under the larger tree (union by rank).",
      "Use case: detect cycles, count connected components, group accounts."
    ],
    codeSnippet: `class UnionFind {
  constructor(n) {
    this.parent = Array.from({length: n}, (_, i) => i);
    this.rank = new Array(n).fill(0);
  }
  find(x) {
    if (this.parent[x] !== x)
      this.parent[x] = this.find(this.parent[x]); // path compression
    return this.parent[x];
  }
  union(x, y) {
    let px = this.find(x), py = this.find(y);
    if (px === py) return false;
    if (this.rank[px] < this.rank[py]) [px, py] = [py, px];
    this.parent[py] = px;
    if (this.rank[px] === this.rank[py]) this.rank[px]++;
    return true;
  }
}`,
    visType: "union-find"
  },
  "Intervals": {
    title: "Intervals + Sweep Line",
    description: "Interval problems involve ranges [start, end]. The key insight is almost always: sort by start time first. Then scan linearly, comparing adjacent intervals for overlap. Sweep line is a generalization where you process events (start/end) in order.",
    howItWorks: [
      "Sort intervals by their start time.",
      "Initialize result with the first interval.",
      "For each subsequent interval, check if it overlaps with the last interval in result (start <= previous end).",
      "If overlapping, merge by extending the end. If not, add as a new interval."
    ],
    codeSnippet: `function merge(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  const res = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const last = res[res.length - 1];
    if (intervals[i][0] <= last[1]) {
      last[1] = Math.max(last[1], intervals[i][1]);
    } else {
      res.push(intervals[i]);
    }
  }
  return res;
}`,
    visType: "intervals"
  }
};

export function getPatternData(label) {
  const lower = label.toLowerCase();
  
  if (lower.includes("two pointers")) return PATTERNS["Two Pointers"];
  if (lower.includes("sliding window")) return PATTERNS["Sliding Window"];
  if (lower.includes("binary search") || lower.includes("search in")) return PATTERNS["Binary Search"];
  if (lower.includes("dynamic programming") || lower.includes(" dp ")) return PATTERNS["Dynamic Programming"];
  if (lower.includes("hash") || lower.includes("anagram") || lower.includes("prefix sum")) return PATTERNS["Hashing"];
  if (lower.includes("stack") || lower.includes("temperature")) return PATTERNS["Stack"];
  if (lower.includes("linked list") || lower.includes("fast and slow")) return PATTERNS["Linked List"];
  if (lower.includes("backtracking") || lower.includes("combination") || lower.includes("permutation") || lower.includes("subset")) return PATTERNS["Backtracking"];
  if (lower.includes("bst")) return PATTERNS["BST"];
  if (lower.includes("tree") || lower.includes("dfs") || lower.includes("depth first")) return lower.includes("bfs") || lower.includes("level order") ? PATTERNS["Tree BFS"] : PATTERNS["Tree DFS"];
  if (lower.includes("graph") || lower.includes("course schedule") || lower.includes("island")) return PATTERNS["Graph"];
  if (lower.includes("greedy") || lower.includes("jump game")) return PATTERNS["Greedy"];
  if (lower.includes("heap") || lower.includes("priority queue") || lower.includes("k frequent") || lower.includes("k closest")) return PATTERNS["Heap"];
  if (lower.includes("trie") || lower.includes("prefix tree") || lower.includes("word dictionary")) return PATTERNS["Trie"];
  if (lower.includes("recursion") || lower.includes("divide") || lower.includes("merge sort")) return PATTERNS["Recursion"];
  if (lower.includes("bit") || lower.includes("xor")) return PATTERNS["Bit Manipulation"];
  if (lower.includes("union") || lower.includes("dsu") || lower.includes("disjoint")) return PATTERNS["Union-Find"];
  if (lower.includes("interval") || lower.includes("sweep line") || lower.includes("merge interval")) return PATTERNS["Intervals"];
  
  // Fallback for missing patterns
  return {
    title: label,
    description: "This is a core Data Structure or Algorithm topic.",
    howItWorks: ["Analyze the problem requirements.", "Identify the brute force approach.", "Optimize time and space complexity.", "Code the solution carefully."],
    codeSnippet: "// Solve it step by step!"
  };
}
