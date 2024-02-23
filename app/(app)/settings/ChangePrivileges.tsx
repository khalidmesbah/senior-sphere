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
import { handleActionResponse } from "@/lib/supabase/helpers";
import { l } from "@/lib/utils";
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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const FormSchema = z.object({
  secret_key: z.string().min(1),
  requested_role: z.enum(["admin", "student", "viewer"]),
});

type FormValues = z.infer<typeof FormSchema>;

export default function ChangePrivileges({
  currentRole,
  id,
  isGuest,
}: {
  currentRole: string;
  id: string;
  isGuest: boolean;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isSecretKeyVisible, setIsSecretKeyVisible] = useState(false);
  const toggleSecretKeyVisibility = () =>
    setIsSecretKeyVisible(!isSecretKeyVisible);
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      secret_key: "",
    },
    mode: "onChange",
  });

  const onSubmit = async () => {
    if (isGuest) {
      onClose();
      handleActionResponse({
        status: "warning",
        message: `As a guest you don't have the priviliges to do this action.`,
      });
      return;
    }
    const res = await updateUser(id, {
      data: {
        secret_key: form.watch().secret_key,
        requested_role: form.watch().requested_role,
      },
    });
    handleActionResponse(res);
    onClose();
  };

  useEffect(() => {
    console.log(form.watch());
  });

  return (
    <>
      <Button
        color="primary"
        onPress={onOpen}
        className="capitalize"
        isDisabled={isGuest}
      >
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
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                      control={form.control}
                      name="requested_role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Secret key for {form.watch().requested_role}{" "}
                            privileges
                          </FormLabel>
                          <FormControl>
                            <RadioGroup
                              label="Types of privileges"
                              isRequired
                              {...field}
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
                              {(currentRole !== "viewer" ||
                                form.watch().requested_role === "viewer") && (
                                <CustomRadio
                                  description="Can only view data."
                                  value="viewer"
                                >
                                  Viewer
                                </CustomRadio>
                              )}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {form.watch().requested_role !== "viewer" && (
                      <FormField
                        control={form.control}
                        name="secret_key"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Secret key for {form.watch().requested_role}{" "}
                              privileges
                            </FormLabel>
                            <FormControl>
                              <Input
                                label="Secret key"
                                variant="bordered"
                                placeholder={`Enter the secret key for the ${
                                  form.watch().requested_role
                                } role.`}
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
                  </form>
                </Form>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={() => onSubmit()}>
                  Claim
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
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
