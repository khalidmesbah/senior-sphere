"use client";

import { EyeFilledIcon, EyeSlashFilledIcon } from "@/components/Icons";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { refresh, updateUser } from "@/lib/supabase/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RadioGroup,
  useRadio,
  VisuallyHidden,
  RadioProps,
  cn,
  Input,
} from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { toast } from "sonner";
import { z } from "zod";
const FormSchema = z.object({
  secret_key: z.string().min(1),
});

type FormValues = z.infer<typeof FormSchema>;

export default function ChangePrivileges({
  currentRole,
}: {
  currentRole: string;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      secret_key: "",
    },
    mode: "onChange",
  });

  console.log(currentRole);

  const [isSecretKeyVisible, setIsSecretKeyVisible] = useState(false);
  const toggleSecretKeyVisibility = () =>
    setIsSecretKeyVisible(!isSecretKeyVisible);
  const [selected, setSelected] = useState<string | undefined>(undefined);

  const onSubmit = async () => {
    const res = await updateUser({
      data: {
        secretKey: form.watch().secret_key,
      },
    });
    if (res.error) {
      toast.error(
        `Requesting ${selected} privileges has been refused, make sure that you have enterd the correct secret key.`,
      );
      return;
    }
    // refresh();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Button color="primary" onPress={onOpen} className="capitalize">
          Change Privileges
        </Button>
        <Modal backdrop={"blur"} isOpen={isOpen} onClose={onClose}>
          <ModalContent>
            {(onClose: () => void) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Claim Privileges
                </ModalHeader>
                <ModalBody>
                  <RadioGroup
                    label="Types of privileges"
                    value={selected}
                    onValueChange={setSelected}
                    isRequired
                  >
                    {currentRole !== "admin" && (
                      <CustomRadio
                        description="Can view, add, delete, update and control everything."
                        value="admin"
                      >
                        Admin
                      </CustomRadio>
                    )}
                    {currentRole !== "student" && (
                      <CustomRadio
                        description="Can view, add, delete, update and control your own data."
                        value="student"
                      >
                        Student
                      </CustomRadio>
                    )}
                    {currentRole !== "guest" && (
                      <CustomRadio
                        description="Can only view data."
                        value="guest"
                      >
                        Guest
                      </CustomRadio>
                    )}
                  </RadioGroup>
                  {selected && (
                    <FormField
                      control={form.control}
                      name="secret_key"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Secret key for {selected} privileges
                          </FormLabel>
                          <FormControl>
                            <Input
                              label="Secret key"
                              variant="bordered"
                              placeholder={`Enter the secret key for the ${selected} role.`}
                              isRequired
                              endContent={
                                <button
                                  className="focus:outline-none"
                                  type="button"
                                  onClick={toggleSecretKeyVisibility}
                                >
                                  {isSecretKeyVisible ? (
                                    <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                  ) : (
                                    <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                  )}
                                </button>
                              }
                              type={isSecretKeyVisible ? "text" : "password"}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button
                    color="primary"
                    type="submit"
                    onClick={() => onSubmit()}
                  >
                    Claim
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </form>
    </Form>
  );
}

export const CustomRadio = (props: RadioProps) => {
  const {
    Component,
    children,
    isSelected,
    description,
    getBaseProps,
    getWrapperProps,
    getInputProps,
    getLabelProps,
    getLabelWrapperProps,
    getControlProps,
  } = useRadio(props);

  return (
    <Component
      {...getBaseProps()}
      className={cn(
        "group inline-flex items-center justify-between hover:bg-content2 flex-row-reverse",
        "cursor-pointer border-2 border-default rounded-lg gap-4 p-4",
        "data-[selected=true]:border-primary",
      )}
    >
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <span {...getWrapperProps()}>
        <span {...getControlProps()} />
      </span>
      <div {...getLabelWrapperProps()}>
        {children && <span {...getLabelProps()}>{children}</span>}
        {description && (
          <span className="text-small text-foreground opacity-70">
            {description}
          </span>
        )}
      </div>
    </Component>
  );
};
