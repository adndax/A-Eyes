import { useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity, Image } from "react-native";
import { Text, View } from "@/components/Themed";
import { X, Check, RotateCcw, Brain } from "lucide-react-native";
import { router } from "expo-router";

export default function LatihanKombinasi() {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [totalQuestions] = useState(1);
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const progressPercentage = (currentQuestion - 1) / totalQuestions;
    setProgress(progressPercentage);
  }, [currentQuestion]);

  const handleCorrectAnswer = () => {
    setScore(score + 1);
    completeExercise();
  };

  const handleWrongAnswer = () => {
    completeExercise();
  };

  const completeExercise = () => {
    setIsCompleted(true);
  };

  const resetExercise = () => {
    setCurrentQuestion(1);
    setScore(0);
    setProgress(0);
    setIsCompleted(false);
  };

  if (isCompleted) {
    const accuracy = Math.round((score / totalQuestions) * 100);

    return (
      <View style={styles.completedContainer}>
        <Text style={styles.completedTitle}>Sesi Latihan Selesai!</Text>

        <View style={styles.celebrationIcon}>
          <Image
            source={require("@/assets/images/done-exercise.png")}
            style={styles.celebrationImage}
          />
        </View>

        <View style={styles.resultCard}>
          <View style={styles.resultRow}>
            <View style={styles.resultItem}>
              <Text style={styles.resultNumber}>{score}</Text>
              <Text style={styles.resultLabel}>Jawaban Benar</Text>
            </View>
            <View style={styles.resultItem}>
              <Text style={styles.resultNumber}>{accuracy}%</Text>
              <Text style={styles.resultLabel}>Akurasi</Text>
            </View>
          </View>
        </View>

        <Text style={styles.motivationText}>
          Keren! Terus latih konsentrasi dan kepekaanmu setiap hari.
        </Text>

        <View style={styles.completedButtonContainer}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.back()}
          >
            <Text style={styles.secondaryButtonText}>
              🏠 Kembali ke Beranda
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push("/riwayat")}
          >
            <Text style={styles.primaryButtonText}>📊 Lihat Riwayat</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.exerciseCard}>
        <Text style={styles.title}>Latihan Kognitif</Text>
        <Text style={styles.subtitle}>
          Soal {currentQuestion} dari {totalQuestions}
        </Text>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${progress * 100}%` }]}
            />
          </View>
        </View>

        <Text style={styles.scoreText}>Skor saat ini: {score}/0</Text>

        <View style={styles.iconContainer}>
          <Brain size={48} color="#fff" />
        </View>

        <Text style={styles.instruction}>
          Dengarkan dan rasakan stimulus...
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.wrongButton}
            onPress={handleWrongAnswer}
          >
            <X size={20} color="#fff" />
            <Text style={styles.buttonText}>Salah</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.correctButton}
            onPress={handleCorrectAnswer}
          >
            <Check size={20} color="#fff" />
            <Text style={styles.buttonText}>Benar</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.retryButton} onPress={resetExercise}>
          <RotateCcw size={20} color="#666" />
          <Text style={styles.retryButtonText}>Ulangi</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
    justifyContent: "center",
  },
  exerciseCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  progressContainer: {
    width: "100%",
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#333",
    borderRadius: 4,
  },
  scoreText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 30,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#4a5568",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  instruction: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 40,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 20,
  },
  wrongButton: {
    backgroundColor: "#D02A2A",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    gap: 8,
  },
  correctButton: {
    backgroundColor: "#48814C",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    gap: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    gap: 8,
  },
  retryButtonText: {
    color: "#666",
    fontSize: 16,
  },
  completedContainer: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  completedTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 30,
    textAlign: "center",
  },
  celebrationIcon: {
    marginBottom: 40,
  },
  celebrationImage: {
    width: 120,
    height: 120,
    resizeMode: "contain",
  },
  resultCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 16,
    padding: 30,
    width: "100%",
    marginBottom: 30,
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  resultItem: {
    alignItems: "center",
  },
  resultNumber: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  resultLabel: {
    fontSize: 14,
    color: "#666",
  },
  motivationText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 24,
  },
  completedButtonContainer: {
    width: "100%",
    gap: 15,
  },
  primaryButton: {
    backgroundColor: "#333",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  secondaryButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
});
