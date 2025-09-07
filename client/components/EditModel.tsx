import {
  View,
  TextInput,
  Modal,
  StyleSheet,
  Button,
  TouchableOpacity,
  Text,
} from "react-native";
import React from "react";

export default function EditModel({
  visible,
  title,
  setTitle,
  content,
  setContent,
  onClose,
  handleSaveEdit,
}: any) {
  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={styles.modalContainer}>
        <TextInput
          style={styles.input}
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="Content"
          value={content}
          onChangeText={setContent}
          multiline
        />
        <Button title="Close" onPress={onClose} />
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveEdit}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
  },
  input: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: "green",
    padding: 12,
    margin: 10,
    borderRadius: 8,
  },
  saveButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});
