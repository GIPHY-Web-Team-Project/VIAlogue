

export const ChatParticipants = ({ participants }) => {
    return (
        <div>
            {participants?.map(participant => (
                <div key={participant.uid} className="participant">
                    <h5>{participant.username}</h5>
                </div>
            ))}
        </div>
    )
}

export default ChatParticipants;