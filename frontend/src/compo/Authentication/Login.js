import { VStack } from "@chakra-ui/react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useToast } from "@chakra-ui/react";
import { useHistory } from "react-router-dom"; // Keep this for React Router v5
import axios from "axios";

const Login = () => {
  const [email, setemail] = useState("");
  const [show, setshow] = useState(false);
  const [pass, setpass] = useState("");
  const handelclick = () => setshow(!show);
  const [loading, setloading] = useState(false);
  const history = useHistory(); // Use useHistory for React Router v5
  const toast = useToast(); // Initialize the toast function

  const loginhandel = async () => {
    setloading(true);
    console.log("Attempting login with:", email, pass);

    if (!email || !pass) {
      toast({
        title: "Please Enter Fields.",
        description: "Please provide all fields.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setloading(false);
      return;
    }

    try {
      const { data } = await axios.post(
        "http://localhost:3001/quickchat/login", // Correct URL
        { email, pass }
      );
      console.log("Response from backend:", data);

      toast({
        title: "Login successful",
        description: "You've successfully logged in.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      // Save user info in localStorage
      localStorage.setItem("userinfo", JSON.stringify(data));
      setloading(false);
      history.push("/chats"); // Redirect after successful login
    } catch (error) {
      console.log("Error:", error);
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
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input onChange={(e) => setemail(e.target.value)} value={email} />
      </FormControl>
      <FormControl id="pass" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            onChange={(e) => setpass(e.target.value)}
            value={pass}
          />
          <InputRightElement width={"4.5rem"}>
            <Button h={"1.75rem"} size={"sm"} onClick={handelclick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        colorScheme="red"
        width={"100%"}
        style={{ marginTop: 15 }}
        onClick={loginhandel}
        isLoading={loading}
      >
        Login
      </Button>
      <Button
        variant={"solid"}
        colorScheme="red"
        width={"100%"}
        style={{ marginTop: 15 }}
        onClick={() => {
          setemail("guest@gmail.com");
          setpass("12345");
        }}
      >
        As Guest
      </Button>
    </VStack>
  );
};

export default Login;
