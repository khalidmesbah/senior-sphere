import AddMaterial from "@/components/AddMaterial";
import { createClient } from "@/lib/supabase/server";
import { l } from "@/lib/utils";
import { cookies } from "next/headers";
import Link from "next/link";
import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";

const page = async () => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const res = await supabase
    .from("material")
    .select("id,name,description,cover_image");
  l(res);
  if (res.error) return <h1>{res.error.message}</h1>;

  return (
    <div className="grid gap-2 grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
      {res.data.map((item, index) => (
        <Card shadow="sm" key={index} isPressable>
          <CardBody className="overflow-visible p-0">
            <Image
              shadow="sm"
              radius="lg"
              width="100%"
              alt={item.name}
              className="w-full object-cover h-[140px]"
              src={item.cover_image!}
            />
          </CardBody>
          <CardFooter className="text-small justify-between">
            <b>{item.name}</b>
            <p className="text-default-500">{item.name}</p>
          </CardFooter>
        </Card>
      ))}
      <AddMaterial />
    </div>
  );
};

export default page;
