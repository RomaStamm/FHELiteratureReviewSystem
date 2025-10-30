interface ConnectionStatusProps {
  connected: boolean;
  userAccount: string;
}

export default function ConnectionStatus({ connected, userAccount }: ConnectionStatusProps) {
  return (
    <div
      className={`fixed top-5 right-5 py-2.5 px-5 rounded-full font-semibold z-50 ${
        connected ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
      }`}
    >
      {connected
        ? `Connected: ${userAccount.slice(0, 6)}...${userAccount.slice(-4)}`
        : 'Disconnected'}
    </div>
  );
}
