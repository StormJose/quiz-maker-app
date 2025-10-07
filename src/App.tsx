import { createBrowserRouter,  RouterProvider } from "react-router"
import Home from "./Home"
import AppLayout from "./ui/AppLayout";
import AllQuizzes from "./features/quizzes/AllQuizzes";
import Quiz, { loader as quizLoader } from "./features/quizzes/Quiz";
import QuizResults from "./features/quizzes/QuizResults";
import InQuiz, {
  loader as questionsLoader,
} from "./features/quiz-taking/InQuiz";
import Register from "./features/users/Register";
import Login from "./features/users/login";
import Builder from "./features/builder/Builder";
import BuilderLayout from "./layouts/builder-layout";
import QuizSettings from "./features/settings/quiz-settings";
import Settings from "./features/users/settings";
import ErrorBoundary from "./ui/error-boundary";


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
    ErrorElement: <ErrorBoundary />,
  },
  {
    path: "/quizzes/:quizId",
    name: "Quiz",
    element: <Quiz />,
    ErrorElement: <ErrorBoundary />,
    loader: quizLoader,
  },

  {
    path: "/quizzes/:quizId/questions/:questionId",
    name: "Questions",
    element: <InQuiz />,
    errorElement: <ErrorBoundary />,
    loader: questionsLoader,
  },
  {
    path: "/quiz/new",
    name: "New Quiz",
    element: <BuilderLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "/",
        name: "New Quiz - Builder",
        element: <Builder />,
        ErrorElement: <ErrorBoundary />,
      },
      {
        path: "settings",
        name: "New Quiz - Settings",
        element: <QuizSettings />,
        ErrorElement: <ErrorBoundary />,
      },
      {
        path: "preview",
        name: "New Quiz - Builder",
        element: <Builder />,
        ErrorElement: <ErrorBoundary />,
      },
    ],
  },
  {
    path: "/quiz/:quizId/edit",
    name: "Edit Quiz",
    element: <BuilderLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "/",
        name: "New Quiz - Builder",
        element: <Builder />,
        ErrorElement: <ErrorBoundary />,
      },
      {
        path: "settings",
        name: "New Quiz - Settings",
        element: <QuizSettings />,
        ErrorElement: <ErrorBoundary />,
      },
      {
        path: "preview",
        name: "New Quiz - Builder",
        element: <Builder />,
        ErrorElement: <ErrorBoundary />,
      },
    ],
  },

  {
    path: "/quiz/results",
    name: "Quiz Results",
    element: <QuizResults />,
  },
];

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: routes.map((route) => ({
      path: route.path === "/" ? undefined : route.path,
      element: route.element,
      index: route.path === "/",
      // errorElement: route.errorElement,
      action: route?.action,
      loader: route.loader,
      children: route.children?.map((route) => ({
        path: route.path === "/" ? undefined : route.path,
        element: route.element,
        index: route.path === "/",
      })),
    })),
  },
  {
    path: "/signup",
    element: <Register />,
  },
  {
    path: "/signin",
    element: <Login />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
]);

function App() {

  return <RouterProvider router={router}/>
  
}

export default App
