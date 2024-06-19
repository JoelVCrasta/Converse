import {
  Text,
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react"

import Login from "../Components/Auth/Login"
import Register from "../Components/Auth/Register"

const Home = () => {
  return (
    <Container maxW="100vw" h="100vh" bg="#2F2D2E" centerContent>
      <Box
        display="flex"
        justifyContent="center"
        p="3"
        w="50%"
        mt="40px"
        borderRadius="lg"
        bg="#444444"
      >
        <Text fontSize="4xl" fontWeight="bold" color="#81A739">
          CONVERSE
        </Text>
      </Box>
      <Box p="4" w="50%" m="40px 0 20px 0" borderRadius="lg" bg="#444444">
        <Tabs variant="soft-rounded" color="#81A739" colorScheme="green">
          <TabList mb="8px" gap="12px">
            <Tab width="50%" color="#81A739">
              Login
            </Tab>
            <Tab width="50%" color="#81A739">
              Register
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Register />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}

export default Home
