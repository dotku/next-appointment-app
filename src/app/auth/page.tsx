// import { GetServerSideProps } from "next";
import AuthClient from "./AuthClient";

const Page = () => <AuthClient />;

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   // You can access search parameters and other context data here
//   const { query } = context;

//   return {
//     props: {
//       // Pass search parameters as props to the component
//       searchParams: query,
//     },
//   };
// };

export default Page;
