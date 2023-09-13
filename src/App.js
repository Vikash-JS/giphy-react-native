import React, { useEffect, useState } from "react";
import {
  Pressable,
  Image,
  TextInput,
  StyleSheet,
  Text,
  View,
  ActivityIndicator
} from "react-native";
import { debounce } from "lodash";

const API_KEY = `l47f70OyKwq0CXSXb4kMBQ8wBRfqN89s`;

function App() {
  const [inputQuery, setInputQuery] = useState("");
  const [sourceImage, setSourceImage] = useState("");

  // Adding error handling
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPressed, setIsPressed] = useState(false);

  // Fetching data from giphy with error handling
  const fetchGifs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/translate?api_key=${API_KEY}&s=${inputQuery}`
      );
      const giphyData = await response.json();
      setSourceImage(giphyData.data.images.original.url);
      setLoading(false);
    } catch (error) {
      console.log(`Error occured due to`, error);
      setError("Failed to fetch GIF. Please try again later.");
      setLoading(false);
    }
  };

  const debouncedFetchGifs = debounce((query) => {
    if (query.trim() !== "" && isPressed) {
      fetchGifs();
    }
  }, 500);

  // onChange handler
  const handleChange = (query) => {
    setInputQuery(query);
    if (!isPressed) {
      debouncedFetchGifs(query);
    }
  };

  // on press handler
  const handleSearch = () => {
    setIsPressed(true);
    if (inputQuery.trim() !== "") {
      fetchGifs();
    }
  };

  useEffect(() => {
    if (inputQuery === "") {
      setSourceImage("");
    }
  }, [inputQuery]);
  // placeholder for input text
  const placeHolder = `Search any gifs`;

  // Need to implement flatlist so if needed to show multiple results
  // Added Activity indicator
  return (
    <>
      <View style={styles.app}>
        <Text style={styles.title}>Seacrh Gifs!</Text>
        <TextInput
          onChangeText={handleChange}
          value={inputQuery}
          placeholder={placeHolder}
          style={styles.input}
        />
        <Pressable onPress={handleSearch} style={buttonStyles.button}>
          <Text style={buttonStyles.text}>Search</Text>
        </Pressable>

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : sourceImage ? (
          <Image style={styles.gifImage} source={{ uri: sourceImage }} />
        ) : null}

        {error && <Text style={styles.error}>{error}</Text>}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  app: {
    alignItems: "center",
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
    backgroundColor: "#f7dcf7"
  },
  input: {
    width: 300,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 2,
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    fontSize: 16,
    backgroundColor: "#fff"
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 20,
    marginTop: 10,
    color: "#333"
  },
  text: {
    lineHeight: "1.5em",
    fontSize: "1.125rem",
    marginVertical: "1em",
    textAlign: "center"
  },
  gifImage: {
    width: 300,
    height: 300,
    marginVertical: 20,
    borderRadius: 10
  },
  error: {
    color: "red",
    fontSize: 16,
    marginVertical: 10
  }
});

const buttonStyles = StyleSheet.create({
  button: {
    backgroundColor: "#CD6688",
    borderRadius: 25,
    padding: 12,
    marginBottom: 20,
    width: 200,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
    textTransform: "uppercase"
  }
});

export default App;
