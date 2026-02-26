export default function LuckyDraw() {
  return (
    <div style={styles.box}>
      <h1>Lucky Draw</h1>
      <p>Coming soon in your country</p>
    </div>
  );
}

const styles = {
  box: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#0b0b0b",
    color: "#fff",
    fontSize: "20px"
  }
};