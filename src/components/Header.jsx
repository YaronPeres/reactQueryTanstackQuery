// to check if react query is currently fetching data we can use useisfetching hook
import { useIsFetching } from "@tanstack/react-query";
export default function Header({ children }) {
  // fetching will be a number = 0 if no fatching data and higher number if there is a fathcing
  const fetching = useIsFetching();
  return (
    <>
      <div id="main-header-loading">{fetching > 0 && <progress />}</div>
      <header id="main-header">
        <div id="header-title">
          <h1>React Events</h1>
        </div>
        <nav>{children}</nav>
      </header>
    </>
  );
}
