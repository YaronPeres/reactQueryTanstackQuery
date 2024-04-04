import {
  Link,
  redirect,
  useNavigate,
  useParams,
  useSubmit,
  useNavigation,
} from "react-router-dom";

import Modal from "../UI/Modal.jsx";
import EventForm from "./EventForm.jsx";
import { useQuery } from "@tanstack/react-query";
import { fetchEvent, queryClient, updateEvent } from "../../util/http.js";

import ErrorBlock from "../UI/ErrorBlock.jsx";

export default function EditEvent() {
  const navigate = useNavigate();
  const submit = useSubmit();
  const params = useParams();
  const { state } = useNavigation();
  const { data, isError, error } = useQuery({
    queryKey: ["evetnts", params.id],
    queryFn: ({ signal }) => fetchEvent({ signal, id: params.id }),
    staleTime: 10000,
  });

  // const { mutate } = useMutation({
  //   mutationFn: updateEvent,
  //   // instead of using onSucces and  queryClient.invalidateQueries we use onMutate:
  //   // onMutate takes a function and will be called at the same time calling mutate. (before process is done before getting a response)
  //   onMutate: async (data) => {
  //     // getting the stored data and manipulate it
  //     // setQueryData takes two arguments, key of the data needed to be changed and the new data needed to be stored.
  //     // reactQuery passes this data which we passed to mutate as a value to on mutate
  //     const newEvent = data.event;
  //     // canceling other queries and it takes a promise.
  //     await queryClient.cancelQueries({ queryKey: ["events", params.id] });

  //     //getting and applying the old data if the updating failed for some reason
  //     const previousEvent = queryClient.getQueriesData("event", params.id);
  //     // updateing the new data
  //     queryClient.setQueryData(["evennts", params.id], newEvent);
  //     return { previousEvent };
  //   },
  //   // if mutationFn fails onError get the error, the data was submitted and context object (context will contain previousEvent)
  //   onError: (error, data, context) => {
  //     queryClient.setQueriesData(["event", params.id], context.previousEvent);
  //   },
  //   // onSettled will be called when the mutating fn is done no matter is it failed or succeeded.
  //   onSettled: () => {
  //     // to be sure that we have the same data in the front-end and backend we need to invalidate the data.
  //     queryClient.invalidateQueries("event", params.id);
  //   },
  // });
  function handleSubmit(formData) {
    // we use a non-get method here to triger the action function by react router
    submit(formData, { method: "PUT" });
    // mutate({ id: params.id, event: formData });
    navigate("../");
  }

  function handleClose() {
    navigate("../");
  }
  let content;

  if (isError) {
    content = (
      <>
        <ErrorBlock
          title="faild to load event"
          message={
            error.info?.message || "failed to load event, check your inputs"
          }
        />
        <div>
          <Link to="../" className="button">
            Okay
          </Link>
        </div>
      </>
    );
  }
  if (data) {
    content = (
      <EventForm inputData={data} onSubmit={handleSubmit}>
        {state === "submitting" ? (
          <p>Sending data...</p>
        ) : (
          <>
            <Link to="../" className="button-text">
              Cancel
            </Link>
            <button type="submit" className="button">
              Update
            </button>
          </>
        )}
      </EventForm>
    );
  }
  return <Modal onClose={handleClose}>{content}</Modal>;
}
export function loader({ params }) {
  return queryClient.fetchQuery({
    queryKey: ["evetnts", params.id],
    queryFn: ({ signal }) => fetchEvent({ signal, id: params.id }),
  });
}
export async function action({ request, params }) {
  const formData = await request.formData();
  const updateEventData = Object.fromEntries(formData);
  await updateEvent({ id: params.id, event: updateEventData });
  await queryClient.invalidateQueries(["event"]);
  return redirect("../");
}
