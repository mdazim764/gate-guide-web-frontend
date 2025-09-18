// src/context/TestContext.jsx
import React, { createContext, useState, useContext, useMemo } from "react";

const TestContext = createContext();

export const useTest = () => useContext(TestContext);

export const TestProvider = ({ children }) => {
  const [quizId, setQuizId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(180 * 60);
  const [currentSection, setCurrentSection] = useState("");

  const deriveSections = (qs) => {
    if (!qs || qs.length === 0) return [];

    // Heuristic: questions with "aptitude" in their source/subject are grouped first.
    // We add an `originalIndex` to each question to always reference the master `questions` array.
    const aptitudeQuestions = qs
      .map((q, i) => ({ ...q, originalIndex: i }))
      .filter((q) =>
        (q.subjectId || q.source || "").toLowerCase().includes("aptitude")
      );
    const technicalQuestions = qs
      .map((q, i) => ({ ...q, originalIndex: i }))
      .filter((q) => !aptitudeQuestions.some((aq) => aq.originalIndex === i));

    const sections = [];
    if (aptitudeQuestions.length > 0)
      sections.push({ name: "General Aptitude", questions: aptitudeQuestions });
    if (technicalQuestions.length > 0)
      sections.push({
        name: "Technical Section",
        questions: technicalQuestions,
      });

    return sections.length > 0
      ? sections
      : [
          {
            name: "Main Section",
            questions: qs.map((q, i) => ({ ...q, originalIndex: i })),
          },
        ];
  };

  const sections = useMemo(() => deriveSections(questions), [questions]);

  const startTest = (id, qs) => {
    setQuizId(id);
    setQuestions(qs);
    setCurrentQuestionIndex(0);
    setAnswers(
      qs.reduce((acc, q, index) => {
        acc[index] = {
          answer: q.type === "MSQ" ? {} : null,
          status: "not-visited",
        };
        return acc;
      }, {})
    );

    const initialSections = deriveSections(qs);
    if (initialSections.length > 0) {
      setCurrentSection(initialSections[0].name);
      updateAnswer(
        0,
        initialSections[0].questions[0].type === "MSQ" ? {} : null,
        "not-answered"
      );
    }
  };

  const updateAnswer = (index, answerPayload, newStatus) => {
    setAnswers((prev) => {
      const newAnswers = { ...prev };
      const question = questions[index];
      if (!question) return prev;

      let newAnswerState = newAnswers[index]?.answer;

      if (question.type === "MSQ") {
        const { option, checked } = answerPayload;
        newAnswerState = { ...newAnswerState, [option]: checked };
      } else {
        newAnswerState = answerPayload;
      }

      let finalStatus = newAnswers[index]?.status || "not-visited";
      if (newStatus) {
        finalStatus = newStatus;
      } else {
        const isAnswered =
          question.type === "MSQ"
            ? Object.values(newAnswerState || {}).some((v) => v)
            : !!newAnswerState;
        if (isAnswered) {
          finalStatus =
            finalStatus === "marked-for-review" ||
            finalStatus === "answered-and-marked"
              ? "answered-and-marked"
              : "answered";
        } else {
          finalStatus =
            finalStatus === "answered-and-marked"
              ? "marked-for-review"
              : "not-answered";
        }
      }

      newAnswers[index] = {
        ...newAnswers[index],
        answer: newAnswerState,
        status: finalStatus,
      };
      return newAnswers;
    });
  };

  const goToQuestion = (index) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
      if (answers[index]?.status === "not-visited") {
        const question = questions[index];
        const emptyAnswer = question.type === "MSQ" ? {} : null;
        updateAnswer(index, emptyAnswer, "not-answered");
      }
    }
  };

  const value = {
    quizId,
    questions,
    answers,
    currentQuestionIndex,
    timeRemaining,
    sections,
    currentSection,
    startTest,
    updateAnswer,
    goToQuestion,
    setTimeRemaining,
    setCurrentSection,
    setCurrentQuestionIndex,
  };

  return <TestContext.Provider value={value}>{children}</TestContext.Provider>;
};
