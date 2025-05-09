import { industries } from "@/data/industries";
import OnBoardingform from "./_components/OnBoardingform";
import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";

const onboardingPage = () => {
    const isUseronboarded = getUserOnboardingStatus();
   // if(isUseronboarded){
     //   redirect("/dashboard");
    // }
    return (
       <main>
        <OnBoardingform industries= {industries}/>

       </main>

    );
}
export default onboardingPage;