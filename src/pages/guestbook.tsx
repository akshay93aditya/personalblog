import Guestbook from "~/components/Guestbook";

const GuestbookPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold bold-text pt-14 text-t-purple">
        Guestbook
      </h1>
      <p className="pt-1 text-slate-200">
        Leave a comment below to sign my Guestbook. It could literally be
        anything - a joke, a quote or even a cool fact. Surprise me!
      </p>

      <div className="pt-8" />

      <Guestbook />
      <div className="pb-8" />
    </div>
  );
};

export default GuestbookPage;
