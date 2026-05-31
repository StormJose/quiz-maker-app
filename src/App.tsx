import { createBrowserRouter,  RouterProvider } from "react-router"
import Home from "./Home"
import AppLayout, { protectedLoader } from "./ui/AppLayout";
import AllQuizzes, {
  loader as allQuizzesLoader,
} from "./features/quizzes/AllQuizzes";
import Quiz, { loader as quizLoader } from "./features/quizzes/Quiz";
import QuizResults from "./features/quizzes/QuizResults";
import InQuiz, {
  loader as questionsLoader,
} from "./features/quiz-taking/InQuiz";
import Register from "./features/users/Register";
import Login from "./features/users/login";
import NewBuilder from "./features/builder/new-builder";
import BuilderLayout, {
  editQuizLoader,
  newQuizLoader,
} from "./layouts/builder-layout";
import QuizSettings from "./features/settings/quiz-settings";
import ErrorBoundary from "./ui/error-boundary";
import Preview from "./features/builder/Preview";
import NotFound from "./ui/NotFound";
import Settings from "./features/users/settings";

const routes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/quizzes",
    element: <AllQuizzes />,
    loader: allQuizzesLoader,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/quizzes/:quizId",
    element: <Quiz />,
    errorElement: <ErrorBoundary />,
    loader: quizLoader,
  },

  {
    path: "/quiz/new",
    id: "new-quiz",
    element: <BuilderLayout />,
    loader: newQuizLoader,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "/",
        element: <NewBuilder />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "settings",
        element: <QuizSettings />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "preview",
        element: <Preview />,
        errorElement: <ErrorBoundary />,
      },
    ],
  },
  {
    path: "/quiz/:quizId/edit",
    id: "edit-quiz",
    element: <BuilderLayout />,
    loader: editQuizLoader,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "/",
        element: <NewBuilder />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "settings",
        element: <QuizSettings />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "preview",
        element: <Preview />,
        errorElement: <ErrorBoundary />,
      },
    ],
  },

  {
    path: "/quiz/results",
    element: <QuizResults />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "/profile/:userId",
  },
  {
    path: "/profile/settings",
  },
];

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    loader: protectedLoader,
    children: routes.map((route) => ({
      path: route.path === "/" ? undefined : route.path,
      element: route.element,
      index: route.path === "/",
      errorElement: route.errorElement,
      loader: route.loader,
      children: route.children?.map((child) => ({
        path: child.path === "/" ? undefined : child.path,
        element: child.element,
        index: child.path === "/",
        errorElement: child.errorElement,
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
    path: "/quizzes/:quizId/questions/:questionId",
    element: <InQuiz />,
    errorElement: <ErrorBoundary />,
    loader: questionsLoader,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {

  return <RouterProvider router={router}/>
  
}

export default App
