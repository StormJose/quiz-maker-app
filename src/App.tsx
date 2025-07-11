import { createBrowserRouter,  RouterProvider } from "react-router"
import Home from "./Home"
import AppLayout from "./ui/AppLayout";
import AllQuizzes, {loader as quizzesLoader} from "./features/quizzes/AllQuizzes";
import Quiz, {loader as quizLoader} from "./features/quizzes/Quiz";
import QuizResults from "./features/quizzes/QuizResults";
import Question, {loader as questionsLoader} from "./features/quiz-taking/InQuiz";
import ErrorElement from "./ui/ErrorElement";
import Builder from "./features/builder/Builder";
import BuilderLayout from "./layouts/builder-layout";
import QuizSettings from "./features/settings/quiz-settings";


const routes = [
  {
    path: "/",
    name: "Home",
    element: <Home />,
  },
  {
    path: "/quizzes",
    name: "Quizzes",
    element: <AllQuizzes />,
    loader: quizzesLoader
  },
  {
    path: "/quizzes/:quizId",
    name: "Quiz",
    element: <Quiz />,
    ErrorElement: <ErrorElement/>,
    loader: quizLoader
  },

  {
    path: "/quizzes/:quizId/questions/:questionId",
    name: "Questions",
    element: <Question />,
    errorElement: <ErrorElement />,
    loader: questionsLoader
  },
  {
    path: "/quiz/new",
    name: "New Quiz",
    element: <BuilderLayout/>,
    errorElement: <ErrorElement />,
    children: [
      {
        path: "/",
        name: "New Quiz - Builder",
        element: <Builder/>,
        ErrorElement: <ErrorElement/>,
        
      },
      {
        path: "settings",
        name: "New Quiz - Settings",
        element: <QuizSettings/>,
        ErrorElement: <ErrorElement/>
      },
      {
        path: "preview",
        name: "New Quiz - Builder",
        element: <Builder/>,
        ErrorElement: <ErrorElement/>
      },
    ]
  },
  {
    path:"/quiz/:quizId/edit",
    name: "Edit Quiz",
    element: <Builder/>,
    errorElement: <ErrorElement/>
  },
  {
    path: "/quizzes/tryout/:quizId/questions/:questionId",
    name: "Test Quiz",
    element: <Question/>,
    loader: questionsLoader
  },
  {
    path: "/quiz/results",
    name: "Quiz Results",
    element: <QuizResults/>
  }

];


export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout/>,
    children: routes.map((route) => ({
      path: route.path === '/' ? undefined : route.path,
      element: route.element,
      index: route.path === '/',
      // errorElement: route.errorElement,
      action: route.action,
      loader: route.loader,
      children: route.children?.map((route) => (
        {
          path: route.path === '/' ? undefined : route.path,
          element: route.element,
          index: route.path === '/'
       }))  
    }))
  }
])

function App() {

  return <RouterProvider router={router}/>
  
}

export default App
