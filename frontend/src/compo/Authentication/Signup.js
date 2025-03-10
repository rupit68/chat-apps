import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import { useHistory } from "react-router-dom"; // Corrected import for React Router v5
import axios from "axios";
import React, { useState } from "react";
import { useToast } from "@chakra-ui/react";

const Signup = () => {
  const [show, setshow] = useState(false);
  const [name, setname] = useState();
  const [email, setemail] = useState();
  const [confpass, setconpass] = useState();
  const [pic, setpic] = useState();
  const [pass, setpass] = useState();
  const [loading, setloading] = useState(false);
  const toast = useToast();
  const handelclick = () => setshow(!show);
  const history = useHistory(); // Using useHistory() for React Router v5

  const postdetails = (pics) => {
    setloading(true);
    if (pics === undefined) {
      toast({
        title: "Please Select Image.",
        description: "We've created your account for you.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-apps");
      data.append("cloud_name", "dxgiyoz2v");
      fetch("https://api.cloudinary.com/v1_1/dxgiyoz2v/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setpic(data.url);
          console.log(data.url);
          setloading(false);
        })
        .catch((err) => {
          console.log(err);
          setloading(false);
        });
    } else {
      toast({
        title: "Please Select Image.",
        description: "We've created your account for you.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
  };

  const signuphandel = async () => {
    setloading(true);

    if (!name || !email || !pass || !confpass) {
      toast({
        title: "Please Enter Fields.",
        description: "Please provide all fields.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (pass !== confpass) {
      toast({
        title: "Passwords Do Not Match.",
        description: "Please ensure the passwords match.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      // Debugging line
      console.log({ name, email, pass, pic });

      const { data } = await axios.post(
        "http://localhost:3001/quickchat/signup",
        {
          name,
          email,
          pass,
          pic,
        }
      );

      toast({
        title: "Registration Successful",
        description: "We've created your account.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      localStorage.setItem("userinfo", JSON.stringify(data));
      setloading(false);
      history.push("/chats");
    } catch (error) {
      console.log(error); // Log error for debugging
      toast({
        title: "Error occurred!",
        description: error.response
          ? error.response.data.message
          : "Unknown error",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setloading(false);
    }
  };

  return (
    <VStack spacing="5px" color={"black"}>
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input onChange={(e) => setname(e.target.value)} />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input onChange={(e) => setemail(e.target.value)} />
      </FormControl>
      <FormControl id="pass" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            onChange={(e) => setpass(e.target.value)}
          />
          <InputRightElement width={"4.5rem"}>
            <Button h={"1.75rem"} size={"sm"} onClick={handelclick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="conpass" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            onChange={(e) => setconpass(e.target.value)}
          />
          <InputRightElement width={"4.5rem"}>
            <Button h={"1.75rem"} size={"sm"} onClick={handelclick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="pic">
        <FormLabel>Upload Your Profile Pic</FormLabel>
        <Input
          type="file"
          p={"1.5"}
          accept="image/*"
          onChange={(e) => postdetails(e.target.files[0])}
        />
      </FormControl>
      <Button
        colorScheme="red"
        width={"100%"}
        style={{ marginTop: 15 }}
        onClick={signuphandel}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
