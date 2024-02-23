"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Tooltip,
  Divider,
} from "@nextui-org/react";
import React, { useCallback, useEffect, useState } from "react";
import { handleActionResponse } from "@/lib/supabase/helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Button,
  Select,
  SelectItem,
  Input,
  Textarea,
  RadioGroup,
  Radio,
} from "@nextui-org/react";
import { QuestionTypes } from "@/lib/constants";
import { l } from "@/lib/utils";
import { DeleteIcon, EditIcon, EyeIcon } from "@/components/Icons";
const QuestionTypesValues = QuestionTypes.map((e) => e.value);
const columns = [
  { name: "QUESTION", uid: "question" },
  { name: "TYPE", uid: "type" },
  { name: "ACTIONS", uid: "actions" },
];
import { v4 } from "uuid";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const FormSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: "Name must be at least 3 characters.",
    })
    .max(60, {
      message: "Name must not be longer than 60 characters.",
    }),
  type: z.custom<string>((val) => QuestionTypesValues.includes(val as string), {
    message: "Select a type.",
  }),
  question: z.string().min(5, {
    message: "Question must be at least 5 characters.",
  }),
  TFQAnswer: z.union([z.string(), z.string().length(0)]).optional(),
  MCQAnswer: z.union([z.string(), z.string().length(0)]).optional(),
});

// current_password: z
//   .union([
//     z
//       .string()
//       .min(6, { message: "Password must be at least 6 characters." })
//       .max(30, {
//         message: "Password must not be longer than 30 characters.",
//       }),
//     z.string().length(0),
//   ])
//   .optional(),

type FormValues = z.infer<typeof FormSchema>;

type Question = {
  id: string;
  question: string;
} & (
  | { type: "mcq"; choices: string[]; answer: string }
  | {
      type: "true-false";
      answer: "true" | "false";
    }
);

const AddQuizPage = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      type: "",
      question: "",
      MCQAnswer: "",
      TFQAnswer: "",
    },
  });
  const [choices, setChoices] = useState<string[]>([]);
  const [choice, setChoice] = useState<string>("");
  const [questions, setQuestions] = useState<Question[]>([]);
  // select multiple choice in mcq, replace RadioGroup

  const onSubmit = ({ question, type, MCQAnswer, TFQAnswer }: FormValues) => {
    console.clear();
    l(`-----submit`);
    // const res = await login(data);
    // router.replace("/")
    // const res = await supabase
    //   .from("material")
    //   .insert([{ name: data.name, description: data.description }])
    //   .select();
    // handleActionResponse({
    //   status: "info",
    //   message: JSON.stringify(res),
    // });
    l(form.watch());
    const newQuestion: any = { id: v4(), question, type };
    if (type === "mcq") {
      if (choices.length === 0) {
        handleActionResponse({
          status: "warning",
          message: "There are no choices.",
        });
        return;
      }
      if (form.watch().MCQAnswer === undefined) {
        handleActionResponse({
          status: "warning",
          message: "There is no selected choice.",
        });
        return;
      }
      newQuestion.choices = choices;
      newQuestion.answer = MCQAnswer;
    } else if (type === "true-false") {
      newQuestion.answer = TFQAnswer;
    }
    l(newQuestion, `newQuestion`);
    setQuestions((questions) => [...questions, newQuestion]);
    handleActionResponse({
      status: "success",
      message: "The question has been added successfully.",
    });

    l(`submit-----`);
  };

  const submitQuiz = useCallback(async () => {
    l(`+++++++++++++++++submitQuiz`);
    l(questions);
    l(`+++++++++++++++++submitQuiz`);
    if (questions.length === 0) {
      handleActionResponse({
        status: "error",
        message: "There are no questions in the quiz.",
      });
    }
  }, [questions]);

  const deleteQuestion = useCallback(
    (id: string) => {
      const question = questions.find((question) => question.id === id)!;
      const index = questions.indexOf(question);
      questions.splice(index, 1);
      setQuestions(() => [...questions]);
    },
    [questions],
  );

  const renderCell = useCallback((question: Question, columnKey: React.Key) => {
    const cellValue = question[columnKey as keyof Question];

    switch (columnKey) {
      case "question":
        return (
          <p className="truncate overflow-hidden overflow-ellipsis w-[25ch]">
            {question.question}
          </p>
        );
      case "type":
        return (
          <Chip
            className="capitalize"
            color={"primary"}
            size="sm"
            variant="flat"
          >
            {cellValue}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Details">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <EyeIcon />
              </span>
            </Tooltip>
            <Tooltip content="Edit question">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <EditIcon />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete question">
              <span
                className="text-lg text-danger cursor-pointer active:opacity-50"
                onClick={() => {
                  decideDirectionRef.current(question.id);
                }}
              >
                <DeleteIcon />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const decideDirectionRef = React.useRef(deleteQuestion);
  useEffect(() => {
    decideDirectionRef.current = deleteQuestion;
  });

  // useEffect(() => {
  //   l(questions);
  // }, [questions]);

  return (
    <div className="p-2 mx-auto max-w-xl">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 mx-auto"
        >
          <h2>Quiz</h2>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Enter the name of the quiz"
                    isRequired
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="shadow" color="primary" className="w-fit">
                Publish quiz
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Quiz Publication</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to publish this quiz? Once published, it
                  will be accessible to all audience.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={submitQuiz}>
                  Publish
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Divider className="my-4" />
          <h2>Questions</h2>
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <FormControl>
                  <div>
                    <Select variant="faded" label="Select a type" {...field}>
                      {QuestionTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="question"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Question</FormLabel>
                <FormControl>
                  <Textarea
                    isRequired
                    {...field}
                    placeholder="Enter your question"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {form.watch().type === "true-false" ? (
            <>
              <FormField
                control={form.control}
                name="TFQAnswer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correct answer</FormLabel>
                    <FormControl>
                      <RadioGroup isRequired {...field}>
                        <Radio value="true">true</Radio>
                        <Radio value="false">false</Radio>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          ) : form.watch().type === "mcq" ? (
            <>
              <Input
                type="text"
                placeholder="add a new choice"
                value={choice}
                onChange={(e) => setChoice(e.currentTarget.value.trim())}
              />

              <Button
                onClick={() => {
                  if (choice === "") {
                    handleActionResponse({
                      status: "warning",
                      message: "The choice is empty.",
                    });
                    return;
                  }
                  if (choices.includes(choice)) {
                    handleActionResponse({
                      status: "warning",
                      message: "The choice already exists.",
                    });
                    return;
                  }
                  setChoices([...choices, choice]);
                  setChoice("");
                }}
              >
                New Choice
              </Button>
              <FormField
                control={form.control}
                name="MCQAnswer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correct answer</FormLabel>
                    <FormControl>
                      <RadioGroup isRequired {...field}>
                        {choices.length > 0 ? (
                          <>
                            {choices.map((choice) => (
                              <Radio key={v4()} value={choice}>
                                {choice}
                              </Radio>
                            ))}
                          </>
                        ) : (
                          <p>No choices</p>
                        )}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          ) : null}
          <Button type="submit" className="w-fit">
            Add Question
          </Button>
        </form>
      </Form>
      <Divider className="my-4" />
      <h2 className="my-4">Preview</h2>
      <div>
        {questions.length !== 0 ? (
          <Table aria-label="All the questions of the quiz">
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn
                  key={column.uid}
                  align={column.uid === "actions" ? "center" : "start"}
                >
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody items={questions}>
              {(item) => (
                <TableRow key={v4()}>
                  {(columnKey) => (
                    <TableCell>{renderCell(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        ) : (
          <p>No questions to preview</p>
        )}
      </div>
    </div>
  );
};

export default AddQuizPage;
