import { redirect } from "next/navigation";

export default function AccountPage() {
  // /account 로 접속하면 바로 '개인 정보' 페이지로 보냅니다.
  redirect("/account/personal-info");
}