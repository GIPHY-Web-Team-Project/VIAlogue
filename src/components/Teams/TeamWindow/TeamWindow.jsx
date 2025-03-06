import { useParams } from 'react-router';

export default function TeamWindow() {
  const { teamId } = useParams();

  return (
    <>
      <h1>TEAM ID {teamId}</h1>
    </>
  );
}
