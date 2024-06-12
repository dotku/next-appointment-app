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

const CheckListItem = ({ children, ifCancel = false }) => (
  <li className="flex items-center">
    <span className="block-inline pe-1">{ifCancel ? "❌" : "✅"}</span>
    {children}
  </li>
);

export default function ReleaseLog() {
  return (
    <>
      <h2 className="text-2xl mt-4 mb-2">Release Log 😎</h2>
      <h3>June, 2024</h3>
      <ol className="list-decimal list-inside">
        <CheckListItem>Redux for next.js</CheckListItem>
        <CheckListItem>Use supabase auth</CheckListItem>
        <CheckListItem>Created delicated page for Admin</CheckListItem>
        <CheckListItem>Dark theme for Admin</CheckListItem>
      </ol>
      <h3 className="mt-4">May, 2024</h3>
      <ol className="list-decimal list-inside">
        <CheckListItem>Create customer</CheckListItem>
        <CheckListItem>Create business</CheckListItem>
        <CheckListItem>Create specialist</CheckListItem>
        <CheckListItem>Create appointment</CheckListItem>
        <CheckListItem>View appointment</CheckListItem>
        <CheckListItem>Specilist first workflow</CheckListItem>
        <CheckListItem>Filters with day and location</CheckListItem>
      </ol>
      <hr className="my-4" />
      <h3 className="text-xl mb-2">FAQs 🤔️</h3>
      <ol className="list-decimal list-inside">
        <li>
          Can business has their own seperate system that won't share with
          platform? Should a business owner has multiple businesses and or one
          business has multiple business owners?
          <div className="m-4">
            <p className="text-gray-400">
              We are focusing on consumer market at this moment.
            </p>
          </div>
        </li>
        <li>
          Can a specialist manage their schedule in the Studio? Should a
          business manager approval their schedule update?
          <div className="m-4">
            <p className="text-gray-400">
              Yes, a specialist can managee the schedule and so does the
              customer, but we don't have business manager feature yet.
            </p>
          </div>
        </li>
      </ol>
      <hr className="my-4" />
      <h3 className="text-xl mb-2">GTD 🏷️</h3>
      <ol className="list-decimal list-inside">
        <li>Search Engine</li>
        <li>Multiple profiles management</li>
        <li>
          Auth system to manage the role and permissions: Supabase Auth with
          [super, specialist, customers]
        </li>
        <li>Specialist approval system</li>
        <li>Appointment conflict checking</li>
        <li>Appointment should be able to reschedule and cancel</li>
        <li>Check-in manager for appointment tracking</li>
        <li>
          We need track down all actions, including who update what kind
          content, in case we need provide customer support.
        </li>
      </ol>
      <hr className="my-4" />
      <h3 className="text-xl mb-2">Nice to have 💡</h3>
      <ol className="list-decimal list-inside">
        <li>Google calendar integration</li>
      </ol>
    </>
  );
}
