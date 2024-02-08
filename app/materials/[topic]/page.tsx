type Props = {
  params: {
    topic: string;
  };
};

const page = ({ params: { topic } }: Props) => {
  return <div>this topic is about {topic}</div>;
};

export default page;
