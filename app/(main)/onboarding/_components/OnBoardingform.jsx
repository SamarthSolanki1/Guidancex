"use client";
import {useForm} from "react-hook-form";
import { useEffect } from "react";
import {zodResolver} from "@hookform/resolvers/zod";
import { onboardingSchema } from "@/app/lib1/schema";
import {  useState } from "react";
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation";
import {  Card,CardContent,CardDescription,CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,SelectGroup
  } from "@/components/ui/select"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/use-fetch";
import { updateuser } from "@/actions/user";
import {toast} from "sonner";
  


const OnBoardingform = ({industries}) => {
    // Initialize with null (this is fine)
    const [selectedIndustry, setSelectedIndustry] = useState(null);
    const router = useRouter();

    const {
      loading: updateLoading,
      fn: updateUserFn,
      data: updateResult,
    } = useFetch(updateuser);
  
    
    const {register, handleSubmit, formState:{errors}, setValue, watch} = useForm({
      resolver: zodResolver(onboardingSchema),
    });
    const onSubmit = async (value) => {
        console.log(value);
        try{
          const formattedIndustry = `${value.industry}-${value.subIndustry
            .toLowerCase()
            .replace(/ /g, "-")}`;
            await updateUserFn({
              ...value,
              industry: formattedIndustry,
            });
        }
        catch(err){
          console.log(err);
        }
    }
    useEffect(() => {
      if (updateResult?.success && !updateLoading) {
        toast.success("Profile completed successfully!");
        router.push("/dashboard");
        router.refresh();
      }
    }, [updateResult, updateLoading]);

    // Find the full industry object based on selected ID
    const selectedIndustryObject = selectedIndustry ? 
      industries.find(ind => ind.id === selectedIndustry) : null;


    
    return (
      <div className="flex items-center justify-center bg-background">
        <Card className="w-full max-w-lg mt-10 mx-2">
          <CardHeader>
            <CardTitle className="gradient-title text-4xl">Complete your profile</CardTitle>
            <CardDescription>
              Select your industry to get personalized career insights and recommendations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <Label htmlFor="industry" className="mb-2 block">Industry</Label>
                <Select className="space-y-2" onValueChange={(value) => {
                  setValue("industry", value);
                  setSelectedIndustry(value);
                  setValue("subIndustry","");
                }}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select an industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {industries.map((ind) => (
                        <SelectItem key={ind.id} value={ind.id}>
                          {ind.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.industry && (
                  <p className="text-sm text-red-500">
                    {errors.industry.message}
                  </p>
                )}
              </div>
              
              <div>
                <Label htmlFor="subIndustry" className="mb-2 block">Sub-Industry</Label>
                <Select 
                  className="space-y-2" 
                  onValueChange={(value) => {
                    setValue("subIndustry", value);
                  }}
                  disabled={!selectedIndustryObject}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a Sub-Industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {selectedIndustryObject?.subIndustries?.map((subInd) => (
                        <SelectItem key={subInd} value={subInd}>
                          {subInd}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.subIndustry && (
                  <p className="text-sm text-red-500">
                    {errors.subIndustry.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience</Label>
                <Input
                  id="experience"
                  type="number"
                  min="0"
                  max="50"
                  placeholder="Enter years of experience"
                  {...register("experience")}
                />
                {errors.experience && (
                  <p className="text-sm text-red-500">
                    {errors.experience.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Skills</Label>
                <Input
                  id="skills"
                  placeholder="e.g., Python, JavaScript, Project Management"
                  {...register("skills")}
                />
                <p className="text-sm text-muted-foreground">
                  Separate multiple skills with commas
                </p>
                {errors.skills && (
                  <p className="text-sm text-red-500">{errors.skills.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Professional Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about your professional background..."
                  className="h-32"
                  {...register("bio")}
                />
                {errors.bio && (
                  <p className="text-sm text-red-500">{errors.bio.message}</p>
                )}
              </div>
              <Button type="submit" className={"w-full"} disabled={updateLoading}>
              {updateLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Complete Profile"
              )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  };

export default OnBoardingform