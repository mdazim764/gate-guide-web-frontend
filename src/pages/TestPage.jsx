// Here is the new, required format for your questionsData JSON array:
// code
// JSON
// [
//   {
//     "text": "Which of the following are prime numbers?",
//     "type": "MSQ", // Can be "MCQ", "MSQ", or "NAT"
//     "options": ["2", "4", "5", "9"],
//     "correctAnswer": ["2", "5"], // For MSQ, the answer is an array
//     "explanation": "..."
//   },
//   {
//     "text": "What is the median of the sample: 9, 18, 11, 14, 15, 17, 10, 69, 11, 13?",
//     "type": "MCQ",
//     "options": ["14", "11", "13.5", "18.7"],
//     "correctAnswer": "13.5", // For MCQ, the answer is a string
//     "explanation": "..."
//   },
//   {
//     "text": "A bag contains 10 red balls and 15 blue balls... (rounded off to two decimal places)",
//     "type": "NAT",
//     "correctAnswer": "0.27", // For NAT, the answer is a string number
//     "options": [], // NAT questions have no options
//     "explanation": "..."
//   }
// ]

//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\/////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
// Prompt Template:

// Please generate a full-length GATE CSE mock test consisting of exactly 65 questions.

// The output must be a single, valid JSON array. Each object in the array represents one question and must conform strictly to the following structure and key names:

// JSON

// {
//     "subjectId": "string",
//     "topicId": "string",
//     "questionText": "string",
//     "options": ["string", "string", ...],
//     "correctAnswer": "string_or_array_of_strings",
//     "explanation": "string",
//     "difficulty": "string",
//     "source": "string",
//     "type": "string"
// }
// Key-Specific Instructions:

// subjectId: Categorize the question into subjects like "General Aptitude", "Engineering Mathematics", "Operating System", "Databases", etc.

// topicId: Provide a more specific topic within the subject, like "CPU Scheduling", "Normalization", "Quantitative Aptitude", etc.

// questionText: The full text of the question. Ensure any special characters or newlines (\n) are properly escaped.

// options: An array of strings representing the possible answers. For NAT questions, this must be an empty array [].

// correctAnswer:

// For type: "MCQ" or type: "NAT", this must be a single string.

// For type: "MSQ", this must be an array of strings, even if there is only one correct option.

// explanation: A detailed step-by-step explanation for the correct answer. Ensure all LaTeX commands (like \frac) and special characters are properly escaped with a double backslash (\\) to maintain valid JSON format.

// difficulty: Assign a difficulty level: "easy", "medium", or "hard".

// source: Use a consistent source identifier, for example, "Gemini GATE CSE Mock 1".

// type: The question type, which must be one of three strings: "MCQ" (Multiple Choice Question), "MSQ" (Multiple Select Question), or "NAT" (Numerical Answer Type).

// Test Structure:

// The test must follow the GATE exam pattern: 10 General Aptitude questions and 55 technical/maths questions.

// Include a realistic mix of "MCQ", "MSQ", and "NAT" questions with varying difficulties.

// Ensure all generated content is syntactically correct and results in a single, parseable JSON array.

//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\/////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

// [
//     {
//         "subjectId": "General Aptitude",
//         "topicId": "Verbal Ability",
//         "questionText": "The lecture was ____ and the students were ____.",
//         "options": [
//             "bored, boring",
//             "boring, bored",
//             "boring, boring",
//             "bored, bored"
//         ],
//         "correctAnswer": "boring, bored",
//         "explanation": "The correct words to use are 'boring' to describe the lecture (the cause of the feeling) and 'bored' to describe the students' feeling. 'Boring' is an adjective that describes something that causes boredom. 'Bored' is an adjective that describes the feeling of being weary and restless through lack of interest.",
//         "difficulty": "easy",
//         "source": "Gemini GATE CSE Mock 1",
//         "type": "MCQ"
//     },
//     {
//         "subjectId": "General Aptitude",
//         "topicId": "Quantitative Aptitude",
//         "questionText": "A shopkeeper sells a product for ₹2750, making a profit of 10%. If he wants to gain a 15% profit, what should be the new selling price?",
//         "options": [
//             "₹2875",
//             "₹3000",
//             "₹2850",
//             "₹2925"
//         ],
//         "correctAnswer": "₹2875",
//         "explanation": "Let the cost price (CP) be $x$. The first selling price (SP1) is ₹2750 with a 10% profit. So, $SP1 = CP + 0.10 \\times CP = 1.10 \\times x$. \\n$2750 = 1.10x \\implies x = 2750 / 1.10 = ₹2500$. \\nThe new desired profit is 15%. The new selling price (SP2) should be: \\n$SP2 = CP + 0.15 \\times CP = 1.15 \\times x = 1.15 \\times 2500 = ₹2875$.",
//         "difficulty": "medium",
//         "source": "Gemini GATE CSE Mock 1",
//         "type": "MCQ"
//     },
//     {
//         "subjectId": "General Aptitude",
//         "topicId": "Analytical Aptitude",
//         "questionText": "If P, Q, R, and S are four friends, and the following statements are true:\\n1. If P is the tallest, then Q is the shortest.\\n2. If R is the shortest, then S is not the tallest.\\nWhich of the following can be concluded if S is the tallest?",
//         "options": [
//             "P is not the tallest.",
//             "Q is the shortest.",
//             "R is the shortest.",
//             "P is the shortest."
//         ],
//         "correctAnswer": "P is not the tallest.",
//         "explanation": "Let's analyze the statements. We are given that S is the tallest. \\nFrom statement 2: 'If R is the shortest, then S is not the tallest'. The contrapositive of this statement is 'If S is the tallest, then R is not the shortest'. Since we know S is the tallest, we can conclude that R is NOT the shortest. \\nFrom statement 1: 'If P is the tallest, then Q is the shortest'. However, since we know S is the tallest, it directly implies that P cannot be the tallest. Therefore, the conclusion is that P is not the tallest.",
//         "difficulty": "medium",
//         "source": "Gemini GATE CSE Mock 1",
//         "type": "MCQ"
//     },
//     {
//         "subjectId": "General Aptitude",
//         "topicId": "Quantitative Aptitude",
//         "questionText": "What is the next number in the series? 2, 3, 5, 9, 17, 33, ___",
//         "options": [],
//         "correctAnswer": "65",
//         "explanation": "The pattern is based on doubling the difference between consecutive terms. \\n$3 - 2 = 1$ \\n$5 - 3 = 2$ \\n$9 - 5 = 4$ \\n$17 - 9 = 8$ \\n$33 - 17 = 16$ \\nThe differences are $1, 2, 4, 8, 16$, which are powers of 2 ($2^0, 2^1, 2^2, 2^3, 2^4$). The next difference will be $2^5 = 32$. So, the next number in the series is $33 + 32 = 65$.",
//         "difficulty": "easy",
//         "source": "Gemini GATE CSE Mock 1",
//         "type": "NAT"
//     },
//     {
//         "subjectId": "General Aptitude",
//         "topicId": "Verbal Ability",
//         "questionText": "Choose the pair that best represents a similar relationship to the one expressed in the original pair: ODIOUS:REPULSIVE",
//         "options": [
//             "CHARMING:OFFENSIVE",
//             "GLARING:BRIGHT",
//             "BEAUTIFUL:UGLY",
//             "MENACING:BENIGN"
//         ],
//         "correctAnswer": "GLARING:BRIGHT",
//         "explanation": "'Odious' and 'Repulsive' are synonyms, with odious being a more intense form of repulsive. Similarly, 'Glaring' is an intense form of 'Bright'. The other options are antonyms or unrelated.",
//         "difficulty": "medium",
//         "source": "Gemini GATE CSE Mock 1",
//         "type": "MCQ"
//     },
//     {
//         "subjectId": "Algorithms",
//         "topicId": "Greedy Algorithms",
//         "questionText": "Which of the following is an example of a greedy algorithm?",
//         "options": [
//             "Dijkstra's Shortest Path Algorithm",
//             "Floyd-Warshall Algorithm",
//             "Bellman-Ford Algorithm",
//             "0/1 Knapsack Problem using Dynamic Programming"
//         ],
//         "correctAnswer": "Dijkstra's Shortest Path Algorithm",
//         "explanation": "Dijkstra's algorithm is a classic example of a greedy algorithm. At each step, it greedily selects the vertex with the smallest known distance from the source that has not yet been visited. Floyd-Warshall and Bellman-Ford are based on dynamic programming. The 0/1 Knapsack problem is typically solved using dynamic programming for an optimal solution.",
//         "difficulty": "easy",
//         "source": "Gemini GATE CSE Mock 1",
//         "type": "MCQ"
//     },
//     {
//         "subjectId": "Databases",
//         "topicId": "Normalization",
//         "questionText": "Which normal form deals with functional dependencies that are not transitive?",
//         "options": [
//             "First Normal Form (1NF)",
//             "Second Normal Form (2NF)",
//             "Third Normal Form (3NF)",
//             "Boyce-Codd Normal Form (BCNF)"
//         ],
//         "correctAnswer": "Third Normal Form (3NF)",
//         "explanation": "A relation is in Third Normal Form (3NF) if it is in 2NF and it has no transitive dependencies. A transitive dependency exists when a non-prime attribute depends on another non-prime attribute, rather than depending directly on the primary key (e.g., A -> B and B -> C, where A is the key).",
//         "difficulty": "easy",
//         "source": "Gemini GATE CSE Mock 1",
//         "type": "MCQ"
//     },
//     {
//         "subjectId": "Operating System",
//         "topicId": "Synchronization",
//         "questionText": "Which of the following statements about processes and threads are TRUE?",
//         "options": [
//             "Threads of the same process share the same address space.",
//             "Processes have their own separate address spaces.",
//             "Context switching between threads is generally faster than between processes.",
//             "Each thread has its own program counter and stack."
//         ],
//         "correctAnswer": [
//             "Threads of the same process share the same address space.",
//             "Processes have their own separate address spaces.",
//             "Context switching between threads is generally faster than between processes.",
//             "Each thread has its own program counter and stack."
//         ],
//         "explanation": "All four statements are true. \\n- Threads within a process share resources like memory (address space) and open files. \\n- Processes are independent units of execution with their own private address spaces. \\n- Because threads share the address space, switching between them doesn't require expensive operations like changing the memory map, making it faster than a process context switch. \\n- Each thread needs its own program counter to keep track of its execution point and its own stack for local variables and function calls.",
//         "difficulty": "hard",
//         "source": "Gemini GATE CSE Mock 1",
//         "type": "MSQ"
//     },
//     {
//         "subjectId": "Computer Networks",
//         "topicId": "TCP/IP Protocols",
//         "questionText": "Which of the following application layer protocols use UDP as the transport layer protocol?",
//         "options": [
//             "HTTP",
//             "FTP",
//             "DNS",
//             "DHCP"
//         ],
//         "correctAnswer": [
//             "DNS",
//             "DHCP"
//         ],
//         "explanation": "- HTTP (Hypertext Transfer Protocol) uses TCP for reliable connection-oriented communication.\\n- FTP (File Transfer Protocol) uses TCP for both its control and data connections.\\n- DNS (Domain Name System) primarily uses UDP for queries because they are small and speed is important. It can use TCP for larger transfers like zone transfers.\\n- DHCP (Dynamic Host Configuration Protocol) uses UDP.",
//         "difficulty": "medium",
//         "source": "Gemini GATE CSE Mock 1",
//         "type": "MSQ"
//     },
//     {
//         "subjectId": "Computer Organization and Architecture",
//         "topicId": "Pipelining",
//         "questionText": "Consider a pipelined processor with 5 stages. The stage delays are 10ns, 8ns, 12ns, 10ns, and 9ns. What should the cycle time of the processor be? (in ns)",
//         "options": [],
//         "correctAnswer": "12",
//         "explanation": "In a pipelined processor, the cycle time is determined by the slowest stage, as all stages must complete in the same amount of time. The stage delays are 10, 8, 12, 10, and 9 ns. The maximum delay is 12 ns. Therefore, the pipeline cycle time must be at least 12 ns.",
//         "difficulty": "medium",
//         "source": "Gemini GATE CSE Mock 1",
//         "type": "NAT"
//     }
// ]




import React from 'react';
import { useTest } from '../context/TestContext';
import TestInterface from '../components/TestInterface';

const TestPage = () => {
  const { questions } = useTest();

  if (!questions || questions.length === 0) {
    return (
        <div className="flex items-center justify-center h-screen">
            <p className="text-2xl">Loading test...</p>
        </div>
    );
  }

  return (
    <div>
      <TestInterface />
    </div>
  );
};

export default TestPage;


