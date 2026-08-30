import { createBrowserRouter,  RouteObject, RouterProvider } from "react-router"
import Home from "./Home"
import AppLayout, { protectedLoader } from "./ui/AppLayout";
import AllQuizzes, {
  loader as allQuizzesLoader,
} from "./features/quizzes/AllQuizzes";
import Quiz, { loader as quizLoader } from "./features/quizzes/Quiz";
import QuizEnd from "./features/quizzes/QuizEnd";
import InQuiz, {
  loader as questionsLoader,
} from "./features/quiz-taking/InQuiz";
import Register from "./features/users/signup";
import Login from "./features/users/login";
import ErrorBoundary from "./ui/error-boundary";
import NotFound from "./ui/not-found";
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
    path: "/quiz/:quizid/end",
    element: <QuizEnd />,
     errorElement: <ErrorBoundary />,
  },
  {
    path: "/quiz/new",
    id: "new-quiz",
    lazy: async () => {
      const { Component, newQuizLoader } = await import("./layouts/builder-layout")
      return { Component, loader: newQuizLoader }

    },

    errorElement: <ErrorBoundary />,
    children: [
      {
  
        path: "/",
        lazy: () => import("./features/builder/new-builder"),
        errorElement: <ErrorBoundary />,
      },
      {
        path: "settings",
        lazy: () => import("./features/settings/quiz-settings"),
        errorElement: <ErrorBoundary />,
      },
      {
        path: "preview",
        lazy: () => import("./features/builder/Preview"),
        errorElement: <ErrorBoundary />,
      },
    ],
  },
  {
    path: "/quiz/:quizId/edit",
    id: "edit-quiz",
    lazy: async () => {
      const { Component, editQuizLoader } = await import ("./layouts/builder-layout");
      return { Component, loader: editQuizLoader }
    } ,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "/",
        lazy: () => import("./features/builder/new-builder"),
        errorElement: <ErrorBoundary />,
      },
      {
        path: "settings",
        lazy: () => import("./features/settings/quiz-settings"),
        errorElement: <ErrorBoundary />,
      },
      {
        path: "preview",
        lazy: () => import("./features/builder/Preview"),
        errorElement: <ErrorBoundary />,
      },
    ],
  },

  {
    path: "/quiz/results",
    // element: <QuizResults />,
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
    children: routes.map((route): RouteObject => {
      const isIndexRoute = route.path === "/";

      const children = route.children?.map((child): RouteObject => {
        const isIndex = child.path === "/";

        if (isIndex) {

          return   {
            lazy: child.lazy,
            index: true,
            errorElement: child.errorElement,
          };
        }

          return   {
            lazy: child.lazy,
            path: child.path,
            index: false,
            errorElement: child.errorElement,
          }; 
      });

      if (isIndexRoute) {
        return {
          path: route.path,
          index: true,
          lazy: route.lazy,
          element: route.element,
          errorElement: route.errorElement,
        };
      }


      return {
        path: route.path,
        index: false,
        lazy: route.lazy,
        element: route.element,
        loader: route.loader,
        errorElement: route.errorElement,
        children,
      };
    }),
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
