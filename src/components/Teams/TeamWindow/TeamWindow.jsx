import { useParams } from 'react-router';

export default function TeamWindow() {
  const { id } = useParams();

  return (
    <>
      <h1>TEAM ID {id}</h1>
    </>
  );
}
