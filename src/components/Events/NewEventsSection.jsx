import { useQuery } from "@tanstack/react-query";

import LoadingIndicator from "../UI/LoadingIndicator.jsx";
import ErrorBlock from "../UI/ErrorBlock.jsx";
import EventItem from "./EventItem.jsx";
import { fetchEvents } from "../../util/http.js";

export default function NewEventsSection() {
  // useQuery hook sends http requests. get the data & get information about the loading state and potential errors
  const { data, isPending, isError, error } = useQuery({
    // Tasnstack does not sent http req, we have to write the code that sends actual http req
    // tanstack then manages the data, error, caching & more.

    // every http request sended should have query key to cache the data that's yielded by that request
    // so that the response we get could be reused in the future if we try to send the same req again
    // the key is an array of value that are then stored by React query
    queryKey: ["events", { max: 3 }],
    // queryFn need a function that returns a promise
    // queryFn: fetchEvents,
    queryFn: ({ signal, queryKey }) => fetchEvents({ signal, ...queryKey[1] }),
    staleTime: 5000,
  });
  let content;

  if (isPending) {
    content = <LoadingIndicator />;
  }

  if (isError) {
    content = (
      <ErrorBlock
        title="An error occurred"
        message={error.info?.message || "Failed to fetch events."}
      />
    );
  }

  if (data) {
    content = (
      <ul className="events-list">
        {data.map((event) => (
          <li key={event.id}>
            <EventItem event={event} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section className="content-section" id="new-events-section">
      <header>
        <h2>Recently added events</h2>
      </header>
      {content}
    </section>
  );
}
