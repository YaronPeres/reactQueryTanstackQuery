import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
// to send data we use useMutation

import Modal from "../UI/Modal.jsx";
import EventForm from "./EventForm.jsx";
import { createNewEvent } from "../../util/http.js";
import ErrorBlock from "../UI/ErrorBlock.jsx";
import { queryClient } from "../../util/http.js";

export default function NewEvent() {
  const navigate = useNavigate();

  // usemutation does not automatically send the req to the backend unlike useQuery that updates all the time.
  // isError boolean if there is an error or not, error contain error details
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: createNewEvent,
    onSuccess: () => {
      // tells React Query that the data fetched by certain queries is outdated now, should be marked as stale and immediate refech the data
      queryClient.invalidateQueries({
        queryKey: ["events"],
      });
      navigate("/events");
    },
  });

  function handleSubmit(formData) {
    mutate({ event: formData });
  }

  return (
    <Modal onClose={() => navigate("../")}>
      <EventForm onSubmit={handleSubmit}>
        {isPending && "Submitting ..."}
        {!isPending && (
          <>
            <Link to="../" className="button-text">
              Cancel
            </Link>
            <button type="submit" className="button">
              Create
            </button>
          </>
        )}
      </EventForm>
      {isError && (
        <ErrorBlock
          title="failed to create event"
          message={
            error.info?.message ||
            "Failed tto create event please check your inputs"
          }
        />
      )}
    </Modal>
  );
}
