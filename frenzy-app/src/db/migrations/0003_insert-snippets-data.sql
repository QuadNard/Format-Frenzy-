-- Custom SQL migration file, put your code below! --
-- 0003_insert_snippets_data.sql
-- Insert the “Classic Mode v0.1” Q&A into mytable using dollar‑quoting for JSONB
-- 0003_insert_snippets_data.sql
-- Insert the "Classic Mode v0.1" question sets into mytable

INSERT INTO "snippets" ("title", "metadata")
VALUES (
  'Classic Mode v0.1',
  $$[
    {
      "id": 1,
      "name": "Set 1",
      "questions": [
        {
          "id": 1,
          "question": "Create a function that uses map to square each element in a list",
          "answer": "def square_all(numbers):\n    return list(map(lambda x: x**2, numbers))\n# Alternative: [x**2 for x in numbers]"
        },
        {
          "id": 2,
          "question": "Implement a sorting function using the key parameter",
          "answer": "def sort_by_last_digit(numbers):\n    return sorted(numbers, key=lambda x: x % 10)"
        },
        {
          "id": 3,
          "question": "Use filter to get only even numbers from a list",
          "answer": "def get_even_numbers(numbers):\n    return list(filter(lambda x: x % 2 == 0, numbers))\n# Alternative: [x for x in numbers if x % 2 == 0]"
        },
        {
          "id": 4,
          "question": "Create a function with *args to find the maximum value",
          "answer": "def find_max(*args):\n    if not args:\n        return None\n    return max(args)"
        },
        {
          "id": 5,
          "question": "Write a function with **kwargs that creates a formatted string",
          "answer": "def format_user(**kwargs):\n    if 'name' not in kwargs:\n        return \"Anonymous\"\n    details = [f\"Name: {kwargs['name']}\"]\n    for key, value in kwargs.items():\n        if key != 'name':\n            details.append(f\"{key.capitalize()}: {value}\")\n    return \", \".join(details)"
        },
        {
          "id": 6,
          "question": "Use zip to interleave two lists",
          "answer": "def interleave(list1, list2):\n    result = []\n    for a, b in zip(list1, list2):\n        result.extend([a, b])\n    return result\n# Alternative: [item for pair in zip(list1, list2) for item in pair]"
        },
        {
          "id": 7,
          "question": "Create a recursive function for factorial (with negative-n guard)",
          "answer": "def factorial(n):\n    if n < 0:\n        raise ValueError(\"n must be non-negative\")\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)"
        },
        {
          "id": 8,
          "question": "Use enumerate to find indices of all occurrences of an element",
          "answer": "def find_all_indices(items, target):\n    return [i for i, item in enumerate(items) if item == target]"
        },
        {
          "id": 9,
          "question": "Implement a memoization decorator (handling both *args & **kwargs)",
          "answer": "from functools import wraps\n\ndef memoize(func):\n    cache = {}\n    @wraps(func)\n    def wrapper(*args, **kwargs):\n        key = (args, tuple(sorted(kwargs.items())))\n        if key not in cache:\n            cache[key] = func(*args, **kwargs)\n        return cache[key]\n    return wrapper\n\n@memoize\ndef fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)"
        },
        {
          "id": 10,
          "question": "Use any/all with generator expressions",
          "answer": "def has_any_negatives(numbers):\n    return any(num < 0 for num in numbers)\n\ndef all_are_positive(numbers):\n    return all(num > 0 for num in numbers)"
        }
      ]
    },
    {
      "id": 2,
      "name": "Set 2",
      "questions": [
        {
          "id": 11,
          "question": "Count elements matching a condition",
          "answer": "def count_if(nums, condition):\n    return sum(1 for num in nums if condition(num))"
        },
        {
          "id": 12,
          "question": "Find the first element that satisfies a condition",
          "answer": "def find_first(nums, condition):\n    return next((num for num in nums if condition(num)), None)"
        },
        {
          "id": 13,
          "question": "Transform elements based on multiple conditions (FizzBuzz style)",
          "answer": "def transform(nums):\n    result = []\n    for num in nums:\n        if num % 3 == 0 and num % 5 == 0:\n            result.append(\"FizzBuzz\")\n        elif num % 3 == 0:\n            result.append(\"Fizz\")\n        elif num % 5 == 0:\n            result.append(\"Buzz\")\n        else:\n            result.append(str(num))\n    return result"
        },
        {
          "id": 14,
          "question": "Process elements until a condition is met",
          "answer": "def process_until(nums, target):\n    result = []\n    for num in nums:\n        if num == target:\n            break\n        result.append(num * 2)\n    return result"
        },
        {
          "id": 15,
          "question": "Skip certain elements in processing",
          "answer": "def skip_negatives(nums):\n    return [num * num for num in nums if num >= 0]\n# Alternative: [num * num for num in nums if num >= 0]"
        },
        {
          "id": 16,
          "question": "Generate a pattern using nested loops",
          "answer": "def generate_pattern(n):\n    return [[j for j in range(1, i + 1)] for i in range(1, n + 1)]"
        },
        {
          "id": 17,
          "question": "Implement a do-while loop equivalent",
          "answer": "def do_while_equivalent(start, end):\n    result = []\n    i = start\n    while True:\n        result.append(i)\n        i += 1\n        if not (i <= end):\n            break\n    return result"
        },
        {
          "id": 18,
          "question": "Use a for-else construct to check if all elements match",
          "answer": "def all_greater_than(nums, threshold):\n    for num in nums:\n        if num <= threshold:\n            return False\n    else:\n        return True"
        },
        {
          "id": 19,
          "question": "Handle exceptions within a loop (operations as callables)",
          "answer": "def safe_process(operations):\n    \"\"\"\n    operations: list of callables taking no arguments.\n    Returns list of results or error messages for ValueError/ZeroDivisionError.\n    \"\"\"\n    results = []\n    for op in operations:\n        try:\n            results.append(op())\n        except ValueError:\n            results.append(\"Invalid operation\")\n        except ZeroDivisionError:\n            results.append(\"Division by zero\")\n    return results"
        },
        {
          "id": 20,
          "question": "Implement a custom sorting function",
          "answer": "def custom_sort(words):\n    return sorted(words, key=lambda w: (len(w), w))\n# Alternative with lambda"
        }
      ]
    },
    {
      "id": 3,
      "name": "Set 3",
      "questions": [
        {
          "id": 21,
          "question": "Find the most frequent element in an array",
          "answer": "from collections import Counter\n\ndef most_frequent(nums):\n    return Counter(nums).most_common(1)[0][0]"
        },
        {
          "id": 22,
          "question": "Check if all characters in a string are unique",
          "answer": "def has_unique_chars(s):\n    return len(s) == len(set(s))"
        },
        {
          "id": 23,
          "question": "Implement binary search on a sorted array",
          "answer": "def binary_search(nums, target):\n    left, right = 0, len(nums) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if nums[mid] == target:\n            return mid\n        elif nums[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1"
        },
        {
          "id": 24,
          "question": "Find all unique pairs in an array that sum to a target",
          "answer": "def find_pairs(nums, target):\n    seen = set()\n    pairs = set()\n    for num in nums:\n        comp = target - num\n        if comp in seen:\n            pairs.add(tuple(sorted((num, comp))))\n        seen.add(num)\n    return list(pairs)"
        },
        {
          "id": 25,
          "question": "Merge two sorted lists",
          "answer": "def merge_sorted_lists(list1, list2):\n    merged = []\n    i = j = 0\n    while i < len(list1) and j < len(list2):\n        if list1[i] <= list2[j]:\n            merged.append(list1[i]); i += 1\n        else:\n            merged.append(list2[j]); j += 1\n    merged.extend(list1[i:]); merged.extend(list2[j:])\n    return merged"
        },
        {
          "id": 26,
          "question": "Find the longest substring without repeating characters",
          "answer": "def longest_substring(s):\n    start = max_length = 0\n    used_chars = {}\n    for i, char in enumerate(s):\n        if char in used_chars and used_chars[char] >= start:\n            start = used_chars[char] + 1\n        used_chars[char] = i\n        max_length = max(max_length, i - start + 1)\n    return max_length"
        },
        {
          "id": 27,
          "question": "Check if one string is a rotation of another",
          "answer": "def is_rotation(s1, s2):\n    return len(s1) == len(s2) and s2 in (s1 + s1)"
        },
        {
          "id": 28,
          "question": "Implement a MinStack (stack with getMin)",
          "answer": "class MinStack:\n    def __init__(self):\n        self.stack = []\n        self.min_stack = []\n\n    def push(self, val):\n        self.stack.append(val)\n        if not self.min_stack or val <= self.min_stack[-1]:\n            self.min_stack.append(val)\n\n    def pop(self):\n        if self.stack[-1] == self.min_stack[-1]:\n            self.min_stack.pop()\n        return self.stack.pop()\n\n    def top(self):\n        return self.stack[-1]\n\n    def getMin(self):\n        return self.min_stack[-1]"
        },
        {
          "id": 29,
          "question": "Implement a sliding window maximum",
          "answer": "from collections import deque\n\ndef max_sliding_window(nums, k):\n    result = []\n    window = deque()\n    for i, num in enumerate(nums):\n        while window and window[0] < i - k + 1:\n            window.popleft()\n        while window and nums[window[-1]] < num:\n            window.pop()\n        window.append(i)\n        if i >= k - 1:\n            result.append(nums[window[0]])\n    return result"
        },
        {
          "id": 30,
          "question": "Find the k most frequent elements in an array",
          "answer": "from collections import Counter\nimport heapq\n\ndef top_k_frequent(nums, k):\n    counter = Counter(nums)\n    return heapq.nlargest(k, counter.keys(), key=counter.get)"
        }
      ]
    }
  ]$$::jsonb);


