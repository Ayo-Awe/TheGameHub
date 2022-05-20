import Image from "next/image";
import AutomaticSignUpButton from "../../Components/AutomaticSignUpButton";
import FormGroup from "../../Components/FormGroup/index";
import OrRibbon from "../../Components/OrRibbon/index";
import BackButton from "../../Components/BackButton/index";
import Link from "next/link";

const SignUp = () => {
  return (
    <div className="py-8  flex flex-col items-center ">
      <div className="flex max-w-2xl self-start mx-12 py-2">
        <Link href="/home">
          <BackButton />
        </Link>
      </div>
      <div className="flex justify-center">
        <Image src="/personRocket.png" width={334} height={334} />
      </div>
      <form action="" className="flex flex-col gap-y-4  max-w-2xl mx-8 ">
        <h2 className="text-left py-4 text-3xl font-bold poppinsFont ">Sign Up</h2>
        <FormGroup title={"Username"} color={"#DF6139"} />
        <FormGroup title={"Email"} color={"#DF6139"} />
        <FormGroup title={"Password"} color={"#DF6139"} />
        <FormGroup className="pb-2" title={"Confirm Password"} color={"#DF6139"} />
        <button className="bg-[#DF6139] text-white w-full font-bold text-2xl py-4 rounded-[13px]">Sign Up</button>
        <OrRibbon colorPicked={"#DF6139"} />
        <div className="flex justify-between mt-[38px] gap-5">
          <AutomaticSignUpButton iconPath={"/googleIcon.svg"} width={48} height={48} />
          <AutomaticSignUpButton iconPath={"/appleIcon.svg"} width={48} height={48} />
        </div>
      </form>
    </div>
  );
};

export default SignUp;
