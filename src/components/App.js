import React, { useEffect, useState } from "react";
import AdminNavBar from "./AdminNavBar";
import QuestionForm from "./QuestionForm";
import QuestionList from "./QuestionList";

function App() {
  const [page, setPage] = useState("List");
  const [questions, setQuestions] = useState([]); // Manage questions state

  useEffect(() => {
    // Fetch the questions from the server
    fetch('http://localhost:4000/questions')
      .then((response) => response.json())
      .then((data) => setQuestions(data));
  }, []);

  // Handle delete in the parent component
  const handleDelete = (id) => {
    fetch(`http://localhost:4000/questions/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          // Update the state after successful deletion
          const updatedQuestions = questions.filter((question) => question.id !== id);
          setQuestions(updatedQuestions); // Update state to remove the deleted question
        } else {
          console.error("Failed to delete the question.");
        }
      })
      .catch((error) => {
        console.error("Error deleting question:", error);
      });
  };

  const handleSubmitForm = (newQuestion) => {
      fetch('http://localhost:4000/questions', {
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json',
        },
          body: JSON.stringify(newQuestion),
      })
        .then((response) => response.json())
        .then((addedQuestion) => {
            setQuestions((prevQuestions) => [...prevQuestions, addedQuestion])
        })
        .catch((error) => console.log("Error adding question", error));
  };

  return (
    <main>
      <AdminNavBar onChangePage={setPage} />
      {page === "Form" ? (
        <QuestionForm onSubmit={handleSubmitForm}/>
      ) : (
        <QuestionList questions={questions} onDelete={handleDelete} /> 
      )}
    </main>
  );
}

export default App;
