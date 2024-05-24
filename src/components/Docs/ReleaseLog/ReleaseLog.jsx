const CheckIcon = () => (
  <svg
    className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
  </svg>
);

export default function ReleaseLog() {
  return (
    <>
      <h2 className="text-2xl mt-4">Release Log</h2>
      <ol className="list-decimal list-inside">
        <li className="flex items-center">
          <CheckIcon />
          Create customer
        </li>
        <li className="flex items-center">
          <CheckIcon />
          Create studio
        </li>
        <li className="flex items-center">
          <CheckIcon />
          Create specialist
        </li>
        <li className="flex items-center">
          <CheckIcon />
          Create appointment
        </li>
        <li className="flex items-center">
          <CheckIcon />
          View appointment
        </li>
        <li className="flex items-center">
          <CheckIcon />
          Filters with day and location
        </li>
      </ol>
      <hr className="my-4" />
      <h3 className="text-xl">FAQs</h3>
      <ol className="list-decimal list-inside">
        <li>
          Can studio has their own seperate system that won't share with
          platform? Should a studio owner has multiple studios and or one studio
          has multiple studio owners?
          <p className="text-gray-500">
            We are focusing on consumer market at this moment.
          </p>
        </li>
        <li>
          Can a specialist manage their schedule in the Studio? Should a studio
          manager approval their schedule update?
          <p className="text-gray-500">
            Yes, a specialist can managee the schedule and so does the customer,
            but we don't have studio manager feature yet.
          </p>
        </li>
      </ol>
      <hr className="my-4" />
      <h3 className="text-xl">GTD</h3>
      <ol className="list-decimal list-inside">
        <li>Auth system to manage the role and permissions: Supabase Auth</li>
        <li>Appointment conflict checking</li>
        <li>Appointment should be able to reschedule and cancel</li>
        <li>Check-in manager for appointment tracking</li>
        <li>
          We need track down all actions, including who update what kind
          content, in case we need provide customer support.
        </li>
      </ol>
    </>
  );
}
