import Image from "next/image";
import Link from "next/link";

export interface MessageListItem {
  id: number;
  user: string;
  preview: string;
  date: string;
  image: string;
}

interface Props {
  message: MessageListItem;
}

export default function MessageItem({ message }: Props) {
  return (
    <Link href={`/messages/${message.id}`}>
      <div className="flex items-center gap-4 p-3 hover:bg-gray-100 rounded-lg cursor-pointer transition">
        <Image
          src={message.image}
          alt={message.user}
          width={48}
          height={48}
          className="rounded-full"
        />
        <div className="flex-1">
          <p className="font-medium">{message.user}</p>
          <p className="text-sm text-gray-500 truncate">{message.preview}</p>
        </div>
        <p className="text-xs text-gray-400 whitespace-nowrap">{message.date}</p>
      </div>
    </Link>
  );
}