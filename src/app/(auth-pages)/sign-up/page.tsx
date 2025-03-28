import { Message, SignUpForm } from '@/components/signup-form';

export default async function SignUp(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;

  return (
    <div className="bg-background flex min-h-svh w-full flex-col items-center justify-center">
      <div className="relative z-10 w-full max-w-sm md:max-w-xl">
        <SignUpForm searchParams={searchParams} />
      </div>
      <svg
        className="absolute bottom-0 top-0  z-0 h-screen w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="a"
            width="116.75"
            height="120"
            patternTransform="rotate(55)scale(1)"
            patternUnits="userSpaceOnUse"
          >
            <rect width="100%" height="100%" fill="none" fillOpacity="0" />
            <path
              fill="#7f4988"
              opacity={0.03}
              d="M0 0v2.51c.33-.2.67-.41 1-.63C1.88 1.3 2.55.67 3.38 0Zm8.27 0c-.46.44-.94.86-1.43 1.28-.92.76-1.84 1.48-2.8 2.2s-2 1.4-3.04 2.04L0 6.1v3.28l1-.54A44.7 44.7 0 0 0 9.88 2.4c.81-.78 1.67-1.57 2.43-2.4Zm8 0-.56.64A46.3 46.3 0 0 1 9.88 6.4c-.96.8-2 1.6-3.04 2.32A42 42 0 0 1 1 12.24l-1 .5v3.03l1-.46c1.04-.47 2.04-1 3.04-1.55.96-.52 1.88-1.08 2.8-1.68a38 38 0 0 0 3.04-2.12A51.7 51.7 0 0 0 19.85 0Zm7.33 0c-.67.98-1.27 1.92-2 2.84a50.4 50.4 0 0 1-5.85 6.28c-.95.88-2 1.76-3.03 2.6-.92.72-1.84 1.4-2.8 2.08-1 .68-2 1.31-3.04 1.95-.92.56-1.84 1.08-2.8 1.56-1 .52-2 1.04-3.04 1.48L0 19.24v2.98l1.04-.43a50.6 50.6 0 0 0 8.88-4.68 57 57 0 0 0 5.84-4.32 57 57 0 0 0 5.83-5.67 74 74 0 0 0 2.8-3.4c.92-1.2 1.71-2.44 2.54-3.72Zm7.26 0-.35.6c-.88 1.4-1.8 2.8-2.8 4.12a57.4 57.4 0 0 1-5.84 6.8c-1 1-2 1.92-3.04 2.84a50 50 0 0 1-2.8 2.27c-1 .76-2 1.52-3.03 2.2-.92.6-1.84 1.2-2.8 1.8-1 .6-2 1.16-3.04 1.72-.92.48-1.84.92-2.8 1.36A69 69 0 0 1 0 25.5v90l1.04-.86a30 30 0 0 0 3.04-2.96c1-1.12 1.96-2.32 2.8-3.56a33.73 33.73 0 0 0 5.84-18.23V22.23a51 51 0 0 0 3.03-2.08v69.66a36.1 36.1 0 0 1-11.68 26c-.95.87-1.73 1.73-2.77 2.5-.35.25-.95.75-1.3.99v.7h3.38a42 42 0 0 0 3.5-3.08 39.7 39.7 0 0 0 5.84-7.32 37 37 0 0 0 3.03-6.03 38.8 38.8 0 0 0 2.8-13.64v-71.9a48 48 0 0 0 3.04-2.64v74.7a42.9 42.9 0 0 1-3.04 14.88 41.6 41.6 0 0 1-5.83 10.15A43 43 0 0 1 8.27 120h4.04l.4-.44a44.9 44.9 0 0 0 8.88-14.68 45 45 0 0 0 2.8-14.71v-77.5a70 70 0 0 0 3.04-3.4v80.86a48.7 48.7 0 0 1-3.04 15.91 47 47 0 0 1-2.8 6.12 55 55 0 0 1-3.04 4.88 44 44 0 0 1-2.28 2.96h3.58a55.6 55.6 0 0 0 4.54-7.12 51.1 51.1 0 0 0 5.84-22.75V5.63A58 58 0 0 0 33.27.97v89.17a54.15 54.15 0 0 1-5.84 23.47 62 62 0 0 1-3.04 5.24L23.6 120h3.33l.5-.8a55.2 55.2 0 0 0 5.84-12.48 57.1 57.1 0 0 0 2.8-16.63V0Zm8.57 0-.32 90.17A60.3 60.3 0 0 1 33.27 115c-.82 1.7-1.45 3.38-2.4 5h5.2l.32-4.4a60.5 60.5 0 0 0 3.04-7.88V120h2.8V47.66a67 67 0 0 0 3.03 7.92V120h2.84V60.9c.96 1.6 1.96 3.2 3.04 4.72V120h2.8V69.26c.96 1.16 2 2.32 3.04 3.4V120h2.84V75.37c1 .92 2 1.8 3.04 2.64V120h2.84V80.17c1 .72 2 1.4 3.04 2.08V120h2.44V83.9c1 .55 2 1.11 3.04 1.6V120h2.83V86.81c1 .44 2.04.84 3.04 1.24V120h2.8V89.01c1 .32 2.04.6 3.04.88V120h2.8V90.53c1 .2 2.04.4 3.04.56V120h2.96V91.53c1 .12 2.04.2 3.04.28V120h11.86c.89-.38 1.75-.83 2.61-1.28 1.04-.56 2-1.31 2.97-2 .5-.34 1.07-.85 1.55-1.23v-90a88 88 0 0 1-4.52 1.42l-2.8.72a59 59 0 0 1-11.68 1.4v30.51a37 37 0 0 1-3.03-.6V0h-2.96v58.22c-1.04-.36-2.08-.8-3.04-1.28V0h-2.8v55.46a23 23 0 0 1-3.04-2.16V0h-2.8v50.82a29 29 0 0 1-3.04-3.6V0h-2.83v42.5a30.55 30.55 0 0 1-3.04-12.95V0h-2.44l-.16 29.59c.04 4.6 1.04 9 2.8 13A33.48 33.48 0 0 0 86.09 58.7a36 36 0 0 0 5.84 2.52 32 32 0 0 0 8.64 1.52V31.83c1.04-.08 2.04-.16 3.04-.28v87.49c-1 .24-2 .44-3.04.6V89.13l-2.8-.12a59 59 0 0 1-5.84-.68 37 37 0 0 1-3.04-.6c-.96-.2-1.88-.44-2.8-.72a58 58 0 0 1-5.84-1.92 60 60 0 0 1-5.84-2.64 75 75 0 0 1-3.03-1.72 42 42 0 0 1-2.8-1.8 84 84 0 0 1-3.04-2.2c-.96-.72-1.88-1.52-2.8-2.27a69 69 0 0 1-3.04-2.84 55 55 0 0 1-5.84-6.8 58 58 0 0 1-5.84-9.76 60 60 0 0 1-5.84-25.4L42.24.01Zm5.83 0-.04 29.67A56.73 56.73 0 0 0 59.7 67.14a57 57 0 0 0 5.84 5.68 57 57 0 0 0 11.67 7.63c1 .48 2.04.96 3.04 1.36.92.4 1.84.76 2.8 1.08 1 .36 2.04.68 3.04 1 .92.28 1.84.52 2.8.76 1 .24 2.04.44 3.04.64a59 59 0 0 0 5.84.76c.92.08 1.88.12 2.8.16v-2.8c-.92-.04-1.88-.08-2.8-.16a71 71 0 0 1-3.04-.32c-.96-.12-1.88-.28-2.8-.44a68 68 0 0 1-3.04-.68c-.96-.24-1.88-.48-2.8-.8-1.04-.32-2.04-.68-3.04-1.04-.96-.36-1.88-.76-2.8-1.16-1.04-.44-2.04-.96-3.04-1.48-.96-.48-1.88-1-2.8-1.56a79 79 0 0 1-3.03-1.95 73 73 0 0 1-2.8-2.08 65 65 0 0 1-3.04-2.6 50.4 50.4 0 0 1-5.84-6.28c-1-1.24-1.92-2.56-2.8-3.88a53 53 0 0 1-3.04-5.24 53.9 53.9 0 0 1-5.84-24.07L48.1 0Zm5.88 0-.08 29.59a50.88 50.88 0 0 0 11.68 32.03 52 52 0 0 0 8.64 8.28c1 .76 2 1.48 3.04 2.16.91.6 1.83 1.16 2.8 1.68a59 59 0 0 0 5.84 2.8c1 .4 2.03.75 3.03 1.11.92.32 1.84.6 2.8.84a42 42 0 0 0 5.84 1.2c1 .16 2.04.28 3.04.36.92.08 1.88.12 2.8.16v-2.8a62 62 0 0 1-2.8-.16c-1.04-.08-2.04-.2-3.04-.36-.96-.16-1.88-.32-2.8-.52a57 57 0 0 1-5.84-1.64 40 40 0 0 1-3.04-1.2 45 45 0 0 1-5.84-3c-.96-.55-1.88-1.2-2.8-1.83a43.5 43.5 0 0 1-5.83-4.84 46 46 0 0 1-3.04-3.24 47.3 47.3 0 0 1-5.84-8.44c-1.08-1.96-2-4-2.8-6.12a48 48 0 0 1-3.04-16.47L53.94 0Zm5.84 0-.08 29.55a44.77 44.77 0 0 0 5.84 21.8 46.2 46.2 0 0 0 5.84 8.11c.88 1 1.84 1.92 2.8 2.84s2 1.76 3.04 2.6a45 45 0 0 0 5.83 3.84 40.6 40.6 0 0 0 5.84 2.72c.92.36 1.84.68 2.8.96 1 .32 2.04.6 3.04.8.92.2 1.84.4 2.8.56 1 .16 2.04.28 3.04.4.92.08 1.84.16 2.8.2v-2.8a37 37 0 0 1-5.84-.64c-.96-.16-1.88-.36-2.8-.6a38 38 0 0 1-5.84-1.92 42 42 0 0 1-3.04-1.4 40 40 0 0 1-5.84-3.6 75 75 0 0 1-2.8-2.2 35 35 0 0 1-3.03-2.92c-1-1.04-1.92-2.12-2.8-3.28a39 39 0 0 1-3.04-4.52 41.9 41.9 0 0 1-5.84-21.07L59.82 0Zm5.88 0-.12 29.47c.04 0 .08.04.12.08h-.12c.04 5 1.04 9.76 2.8 14.12a39.2 39.2 0 0 0 5.84 10 39.7 39.7 0 0 0 5.84 5.91 33 33 0 0 0 3.03 2.24c.92.6 1.84 1.16 2.8 1.72 1 .56 2 1.04 3.04 1.52.92.4 1.84.8 2.8 1.12a38.4 38.4 0 0 0 5.84 1.6c1 .2 2.04.32 3.04.44.92.08 1.84.16 2.8.2v-2.8a37 37 0 0 1-5.84-.68c-.96-.2-1.88-.44-2.8-.68a27 27 0 0 1-3.04-1.04 34.65 34.65 0 0 1-11.68-7.32c-1-.92-1.92-1.88-2.8-2.88a34 34 0 0 1-3.03-4.08c-1.08-1.64-2-3.4-2.8-5.2a35.65 35.65 0 0 1-3.04-14.15L65.7 0Zm34.9 0v2.76A37 37 0 0 0 103.6 2a32 32 0 0 0 6.03-2Zm18.04 0-.56.36a34.7 34.7 0 0 1-5.84 2.88c-1 .4-2 .76-3.04 1.04-.92.24-1.83.48-2.8.68-1 .2-2 .36-3.03.48-.92.08-1.84.16-2.8.2v2.8c.96-.04 1.88-.12 2.8-.2 1-.12 2.04-.24 3.04-.44a38.4 38.4 0 0 0 8.64-2.72 79 79 0 0 0 4.55-2.57V0Zm.96 6.1c-.5.28-3 1.62-4.04 2.06-.92.4-2.36 1-3.32 1.32a38 38 0 0 1-5.83 1.48 37 37 0 0 1-5.84.64v2.8c.96 0 1.88-.08 2.8-.16 1-.12 2.04-.24 3.04-.4.96-.16 1.87-.36 2.8-.56 1-.24 2.03-.48 3.03-.8.96-.28 2.4-.88 3.32-1.24 1.04-.4 3.54-1.6 4.04-1.86zm0 6.63c-.5.24-1.43.7-1.94.92-1 .44-1.58.75-2.62 1.1a57 57 0 0 1-5.84 1.64c-.92.2-1.83.36-2.8.52-1 .16-2 .28-3.03.36-.92.08-1.84.12-2.8.16v2.8c.92-.04 1.88-.08 2.8-.16 1-.08 2.04-.2 3.04-.36a42 42 0 0 0 5.84-1.2 35 35 0 0 0 2.8-.84c1-.36 1.6-.62 2.6-1.02.52-.22 1.45-.66 1.95-.88zm0 6.51c-.48.2-1.4.62-1.9.8-1 .37-1.58.63-2.62.95-.92.32-1.84.56-2.8.8-1 .24-2 .48-3.04.68-.92.16-1.83.32-2.8.44-1 .12-2 .24-3.03.32-.92.08-1.88.12-2.8.16v2.8c.92-.04 1.88-.08 2.8-.16a59 59 0 0 0 5.84-.76c1-.2 2.03-.4 3.03-.64.96-.24 1.88-.48 2.8-.76 1-.32 1.62-.55 2.62-.9.5-.17 1.42-.56 1.9-.75zM9.84 23.95v65.98a30.9 30.9 0 0 1-3.04 12.6V25.55a73 73 0 0 0 3.04-1.6M4 26.83v80.37a33 33 0 0 1-3.04 3.6V28.07C2 27.67 3 27.27 4 26.83m111.2 2.2v84.19c-.96.76-2 1.58-3.04 2.22V29.91a67 67 0 0 0 3.04-.88m-5.88 1.6v86.33c-1 .48-2 .88-3.04 1.24v-87c1.04-.16 2.04-.36 3.04-.56zm7.44 88.67c-.36.24-.6.48-.96.7h.96z"
            />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#a)" />
      </svg>
    </div>
  );
}
