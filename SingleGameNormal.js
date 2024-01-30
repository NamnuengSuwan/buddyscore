import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
} from 'react-native';

import firestore from './config'; // Import firestore from your firebase.js file

export function SingleGameNormal() {
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [player1GamesWon, setPlayer1GamesWon] = useState(0);
  const [player2GamesWon, setPlayer2GamesWon] = useState(0);
  const [game1Score, setGame1Score] = useState({ player1: 0, player2: 0 });
  const [game2Score, setGame2Score] = useState({ player1: 0, player2: 0 });
  const [game3Score, setGame3Score] = useState({ player1: 0, player2: 0 });
  const [isPlayer1Serving, setIsPlayer1Serving] = useState(true);
  const [isPlayer1Standing, setIsPlayer1Standing] = useState(true);
  const [gameNumber, setGameNumber] = useState(1);
  const [totalGames, setTotalGames] = useState(3);

  useEffect(() => {
    if (player1Score === 21 || player2Score === 21) {
      if (Math.abs(player1Score - player2Score) >= 2) {
        handleGameWon(player1Score > player2Score ? 1 : 2);

        if (gameNumber === totalGames) {
          // บันทึกคะแนนลงใน Firebase
          saveGameData();
          alert(
            'Game over! Player ' +
              (player1Score > player2Score ? '1' : '2') +
              ' wins!'
          );
        } else {
          setGameNumber(gameNumber + 1);
          setPlayer1Score(0);
          setPlayer2Score(0);
          setIsPlayer1Standing(gameNumber % 2 === 0); // สลับตำแหน่งผู้เล่นที่เริ่มเสิร์ฟเมื่อเกมใหม่เริ่ม
          setIsPlayer1Serving(!isPlayer1Serving); // สลับตำแหน่งลูกแบดมินตันตามผู้เล่นที่ชนะในเกมก่อนหน้า
        }
      }
    }
  }, [player1Score, player2Score, gameNumber, totalGames]);

  const switchServing = () => {
    setIsPlayer1Serving(!isPlayer1Serving);
  };

  useEffect(() => {
    if (
      (isPlayer1Serving && (player1Score || player1Score === 0)) ||
      (!isPlayer1Serving && (player2Score || player2Score === 0))
    ) {
      // ถ้าผู้ที่กำลังเสิร์ฟมีคะแนน
      setIsPlayer1Standing(
        (isPlayer1Serving && player1Score % 2 === 0) ||
          (!isPlayer1Serving && player2Score % 2 === 0)
      );
    }
  }, [isPlayer1Serving, player1Score, player2Score]);

  const resetScores = () => {
    setPlayer1Score(0);
    setPlayer2Score(0);
    setGameNumber(1);
    setIsPlayer1Serving(true); // รีเซ็ตให้ Player 1 เริ่มเสิร์ฟ
  };

  const increaseScore = (player) => {
    if (player === 1) {
      setPlayer1Score(player1Score + 1);
      setIsPlayer1Serving(true); // ตั้งให้ Player 1 เป็นผู้เสิร์ฟเมื่อ Player 1 ได้คะแนน
    } else {
      setPlayer2Score(player2Score + 1);
      setIsPlayer1Serving(false); // ตั้งให้ Player 2 เป็นผู้เสิร์ฟเมื่อ Player 2 ได้คะแนน
    }
  };

  const handleGameWon = (player) => {
    if (player === 1) {
      setPlayer1GamesWon(player1GamesWon + 1);
      updateGameScore(player, player1Score, player2Score);
    } else {
      setPlayer2GamesWon(player2GamesWon + 1);
      updateGameScore(player, player1Score, player2Score);
    }

    if (player1GamesWon + player2GamesWon === totalGames) {
      setIsPlayer1Serving(!isPlayer1Serving);
    }
  };

  const updateGameScore = (player, score1, score2) => {
  const updatedGameScore = { ...game1Score }; // Assume updating game 1 by default

  if (gameNumber === 1) {
    updatedGameScore.player1 = score1;
    updatedGameScore.player2 = score2;
    setGame1Score(updatedGameScore);
  } else if (gameNumber === 2) {
    updatedGameScore.player1 = score1;
    updatedGameScore.player2 = score2;
    setGame2Score(updatedGameScore);
  } else if (gameNumber === 3) {
    updatedGameScore.player1 = score1;
    updatedGameScore.player2 = score2;
    setGame3Score(updatedGameScore);

    // Reset individual player scores after updating the game scores
    setPlayer1Score(0);
    setPlayer2Score(0);
  }
};


  const decreaseScore = (player) => {
    if (player === 1 && player1Score > 0) {
      setPlayer1Score(player1Score - 1);
    } else if (player === 2 && player2Score > 0) {
      setPlayer2Score(player2Score - 1);
    }
  };

  const saveGameData = async () => {
  try {
    // Prepare game data
    const gameData = {
      player1GamesWon,
      player2GamesWon,
      game1: game1Score,
      game2: game2Score,
      game3: game3Score,
    };

    // Update the game data based on the current game number
    if (gameNumber === 1) {
      gameData.game1 = { player1: player1Score, player2: player2Score };
    } else if (gameNumber === 2) {
      gameData.game2 = { player1: player1Score, player2: player2Score };
    } else if (gameNumber === 3) {
      gameData.game3 = { player1: player1Score, player2: player2Score };
    }

    // Save data to Firestore
    await firestore.collection('games').add(gameData);

    console.log('Game data saved to Firestore.');
  } catch (error) {
    console.error('Error saving game data:', error);
  }
};


  const renderGameRow = ({ item }) => {
    return (
      <View style={styles.gameTableRow}>
        <Text style={styles.gameTableCell}>{item.name}</Text>
        <Text style={styles.gameTableCell}>{item.gamesWon}</Text>
        <Text style={styles.gameTableCell}>{item.game1}</Text>
        <Text style={styles.gameTableCell}>{item.game2}</Text>
        <Text style={styles.gameTableCell}>{item.game3}</Text>
      </View>
    );
  };

  const games = [
    {
      name: 'Player',
      gamesWon: 'Games Won',
      game1: 'Game 1',
      game2: 'Game 2',
      game3: 'Game 3',
    },
    {
      name: 'Player 1',
      gamesWon: player1GamesWon,
      game1: game1Score.player1,
      game2: game2Score.player1,
      game3: game3Score.player1,
    },
    {
      name: 'Player 2',
      gamesWon: player2GamesWon,
      game1: game1Score.player2,
      game2: game2Score.player2,
      game3: game3Score.player2,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.topButtons}>
        <TouchableOpacity style={styles.button} onPress={switchServing}>
          <Text style={styles.buttonText}>Switch Serving</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={resetScores}>
          <Text style={styles.buttonText}>Reset Scores</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.gameText}>
        Game {gameNumber} of {totalGames}
      </Text>
      <View style={styles.scoreContainer}>
        <View style={styles.scoreColumn}>
          {gameNumber === 1 && (
            <>
              <Text style={styles.scoreText}>Player 1:</Text>
              <View style={styles.scoreRow}>
                <TouchableOpacity
                  style={[styles.roundButton, { backgroundColor: 'green' }]}
                  onPress={() => increaseScore(1)}>
                  <Text
                    style={[
                      styles.buttonText,
                      { color: 'white', fontWeight: 'bold' },
                    ]}>
                    +
                  </Text>
                </TouchableOpacity>
                <Text style={styles.score}>
                  {gameNumber === 1 ? player1Score : ''}
                </Text>
                <TouchableOpacity
                  style={[styles.roundButton, { backgroundColor: 'red' }]}
                  onPress={() => decreaseScore(1)}>
                  <Text
                    style={[
                      styles.buttonText,
                      { color: 'white', fontWeight: 'bold' },
                    ]}>
                    -
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
          {gameNumber === 2 && (
            <>
              <Text style={styles.scoreText}>Player 2:</Text>
              <View style={styles.scoreRow}>
                <TouchableOpacity
                  style={[styles.roundButton, { backgroundColor: 'green' }]}
                  onPress={() => increaseScore(2)}>
                  <Text
                    style={[
                      styles.buttonText,
                      { color: 'white', fontWeight: 'bold' },
                    ]}>
                    +
                  </Text>
                </TouchableOpacity>
                <Text style={styles.score}>
                  {gameNumber === 2 ? player2Score : ''}
                </Text>
                <TouchableOpacity
                  style={[styles.roundButton, { backgroundColor: 'red' }]}
                  onPress={() => decreaseScore(2)}>
                  <Text
                    style={[
                      styles.buttonText,
                      { color: 'white', fontWeight: 'bold' },
                    ]}>
                    -
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
          {gameNumber === 3 && (
            <>
              <Text style={styles.scoreText}>Player 1:</Text>
              <View style={styles.scoreRow}>
                <TouchableOpacity
                  style={[styles.roundButton, { backgroundColor: 'green' }]}
                  onPress={() => increaseScore(1)}>
                  <Text
                    style={[
                      styles.buttonText,
                      { color: 'white', fontWeight: 'bold' },
                    ]}>
                    +
                  </Text>
                </TouchableOpacity>
                <Text style={styles.score}>
                  {gameNumber === 3 ? player1Score : ''}
                </Text>
                <TouchableOpacity
                  style={[styles.roundButton, { backgroundColor: 'red' }]}
                  onPress={() => decreaseScore(1)}>
                  <Text
                    style={[
                      styles.buttonText,
                      { color: 'white', fontWeight: 'bold' },
                    ]}>
                    -
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
        <View style={styles.scoreColumn}>
          {gameNumber === 1 && (
            <>
              <Text style={styles.scoreText}>Player 2:</Text>
              <View style={styles.scoreRow}>
                <TouchableOpacity
                  style={[styles.roundButton, { backgroundColor: 'green' }]}
                  onPress={() => increaseScore(2)}>
                  <Text
                    style={[
                      styles.buttonText,
                      { color: 'white', fontWeight: 'bold' },
                    ]}>
                    +
                  </Text>
                </TouchableOpacity>
                <Text style={styles.score}>
                  {gameNumber === 1 ? player2Score : ''}
                </Text>
                <TouchableOpacity
                  style={[styles.roundButton, { backgroundColor: 'red' }]}
                  onPress={() => decreaseScore(2)}>
                  <Text
                    style={[
                      styles.buttonText,
                      { color: 'white', fontWeight: 'bold' },
                    ]}>
                    -
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
          {gameNumber === 2 && (
            <>
              <Text style={styles.scoreText}>Player 1:</Text>
              <View style={styles.scoreRow}>
                <TouchableOpacity
                  style={[styles.roundButton, { backgroundColor: 'green' }]}
                  onPress={() => increaseScore(1)}>
                  <Text
                    style={[
                      styles.buttonText,
                      { color: 'white', fontWeight: 'bold' },
                    ]}>
                    +
                  </Text>
                </TouchableOpacity>
                <Text style={styles.score}>
                  {gameNumber === 2 ? player1Score : ''}
                </Text>
                <TouchableOpacity
                  style={[styles.roundButton, { backgroundColor: 'red' }]}
                  onPress={() => decreaseScore(1)}>
                  <Text
                    style={[
                      styles.buttonText,
                      { color: 'white', fontWeight: 'bold' },
                    ]}>
                    -
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
          {gameNumber === 3 && (
            <>
              <Text style={styles.scoreText}>Player 2:</Text>
              <View style={styles.scoreRow}>
                <TouchableOpacity
                  style={[styles.roundButton, { backgroundColor: 'green' }]}
                  onPress={() => increaseScore(2)}>
                  <Text
                    style={[
                      styles.buttonText,
                      { color: 'white', fontWeight: 'bold' },
                    ]}>
                    +
                  </Text>
                </TouchableOpacity>
                <Text style={styles.score}>
                  {gameNumber === 3 ? player2Score : ''}
                </Text>
                <TouchableOpacity
                  style={[styles.roundButton, { backgroundColor: 'red' }]}
                  onPress={() => decreaseScore(2)}>
                  <Text
                    style={[
                      styles.buttonText,
                      { color: 'white', fontWeight: 'bold' },
                    ]}>
                    -
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
      <Image
        source={require('./badminton_court.jpg')}
        style={styles.badmintonCourt}
      />
      <Image
        source={require('./badminton_icon.png')}
        style={[
          styles.badmintonBirdie,
          {
            top: isPlayer1Serving ? '35%' : '27%',
            left: isPlayer1Serving ? '15%' : '73%',
            opacity:
              gameNumber === 1 && isPlayer1Serving && isPlayer1Standing ? 1 : 0, // player 1 คะแนนคู่
          },
        ]}
      />
      <Image
        source={require('./badminton_icon.png')}
        style={[
          styles.badmintonBirdie,
          {
            top: isPlayer1Serving ? '27%' : '35%',
            left: isPlayer1Serving ? '73%' : '15%',
            opacity:
              gameNumber === 2 && isPlayer1Serving && isPlayer1Standing ? 1 : 0,
          },
        ]}
      />
      <Image
        source={require('./badminton_icon.png')}
        style={[
          styles.badmintonBirdie,
          {
            top: isPlayer1Serving ? '35%' : '27%',
            left: isPlayer1Serving ? '15%' : '73%',
            opacity:
              gameNumber === 3 && isPlayer1Serving && isPlayer1Standing ? 1 : 0,
          },
        ]}
      />
      <Image
        source={require('./badminton_icon.png')}
        style={[
          styles.badmintonBirdie,
          {
            top: isPlayer1Serving ? '27%' : '35%',
            left: isPlayer1Serving ? '15%' : '73%',
            opacity:
              gameNumber === 1 && !isPlayer1Serving && !isPlayer1Standing
                ? 1
                : 0, // player 2 คะแนนคี่
          },
        ]}
      />
      <Image
        source={require('./badminton_icon.png')}
        style={[
          styles.badmintonBirdie,
          {
            top: isPlayer1Serving ? '35%' : '27%',
            left: isPlayer1Serving ? '73%' : '15%',
            opacity:
              gameNumber === 2 && !isPlayer1Serving && !isPlayer1Standing
                ? 1
                : 0,
          },
        ]}
      />
      <Image
        source={require('./badminton_icon.png')}
        style={[
          styles.badmintonBirdie,
          {
            top: isPlayer1Serving ? '27%' : '35%',
            left: isPlayer1Serving ? '15%' : '73%',
            opacity:
              gameNumber === 3 && !isPlayer1Serving && !isPlayer1Standing
                ? 1
                : 0,
          },
        ]}
      />
      <Image
        source={require('./badminton_icon.png')}
        style={[
          styles.badmintonBirdie,
          {
            top: isPlayer1Serving ? '35%' : '27%',
            left: isPlayer1Serving ? '15%' : '73%',
            opacity:
              gameNumber === 1 && !isPlayer1Serving && isPlayer1Standing
                ? 1
                : 0, // player 2 คะแนนคู่
          },
        ]}
      />
      <Image
        source={require('./badminton_icon.png')}
        style={[
          styles.badmintonBirdie,
          {
            top: isPlayer1Serving ? '27%' : '35%',
            left: isPlayer1Serving ? '73%' : '15%',
            opacity:
              gameNumber === 2 && !isPlayer1Serving && isPlayer1Standing
                ? 1
                : 0,
          },
        ]}
      />
      <Image
        source={require('./badminton_icon.png')}
        style={[
          styles.badmintonBirdie,
          {
            top: isPlayer1Serving ? '35%' : '27%',
            left: isPlayer1Serving ? '15%' : '73%',
            opacity:
              gameNumber === 3 && !isPlayer1Serving && isPlayer1Standing
                ? 1
                : 0,
          },
        ]}
      />
      <Image
        source={require('./badminton_icon.png')}
        style={[
          styles.badmintonBirdie,
          {
            top: isPlayer1Serving ? '27%' : '35%',
            left: isPlayer1Serving ? '15%' : '73%',
            opacity:
              gameNumber === 1 && isPlayer1Serving && !isPlayer1Standing
                ? 1
                : 0, // player 1 คะแนนคี่
          },
        ]}
      />
      <Image
        source={require('./badminton_icon.png')}
        style={[
          styles.badmintonBirdie,
          {
            top: isPlayer1Serving ? '35%' : '27%',
            left: isPlayer1Serving ? '73%' : '15%',
            opacity:
              gameNumber === 2 && isPlayer1Serving && !isPlayer1Standing
                ? 1
                : 0,
          },
        ]}
      />
      <Image
        source={require('./badminton_icon.png')}
        style={[
          styles.badmintonBirdie,
          {
            top: isPlayer1Serving ? '27%' : '35%',
            left: isPlayer1Serving ? '15%' : '73%',
            opacity:
              gameNumber === 3 && isPlayer1Serving && !isPlayer1Standing
                ? 1
                : 0,
          },
        ]}
      />
      <Image
        source={require('./player_symbol.png')}
        style={[
          styles.playerSymbol,
          {
            top: isPlayer1Standing ? '35%' : '27%',
            left: isPlayer1Standing ? '15%' : '15%',
            opacity: gameNumber === 1 ? 1 : 0, // แสดงในเกม 1
          },
        ]}
      />
      <Image
        source={require('./player_symbol.png')}
        style={[
          styles.playerSymbol,
          {
            top: isPlayer1Standing ? '27%' : '35%',
            left: isPlayer1Standing ? '73%' : '73%',
            opacity: gameNumber === 2 ? 1 : 0, // แสดงในเกม 2
          },
        ]}
      />
      <Image
        source={require('./player_symbol.png')}
        style={[
          styles.playerSymbol,
          {
            top: isPlayer1Standing ? '35%' : '27%',
            left: isPlayer1Standing ? '15%' : '15%',
            opacity: gameNumber === 3 ? 1 : 0, // แสดงในเกม 3
          },
        ]}
      />
      <Image
        source={require('./player_symbol2.png')}
        style={[
          styles.playerSymbol,
          {
            top: isPlayer1Standing ? '27%' : '35%',
            left: isPlayer1Standing ? '73%' : '73%',
            opacity: gameNumber === 1 ? 1 : 0, // แสดงในเกม 1
          },
        ]}
      />
      <Image
        source={require('./player_symbol2.png')}
        style={[
          styles.playerSymbol,
          {
            top: isPlayer1Standing ? '35%' : '27%',
            left: isPlayer1Standing ? '15%' : '15%',
            opacity: gameNumber === 2 ? 1 : 0, // แสดงในเกม 2
          },
        ]}
      />
      <Image
        source={require('./player_symbol2.png')}
        style={[
          styles.playerSymbol,
          {
            top: isPlayer1Standing ? '27%' : '35%',
            left: isPlayer1Standing ? '73%' : '73%',
            opacity: gameNumber === 3 ? 1 : 0, // แสดงในเกม 3
          },
        ]}
      />

      <Text style={styles.servingText}>
        {isPlayer1Serving ? 'Player 1 is serving' : 'Player 2 is serving'}
      </Text>
      <Text style={styles.tableText}>Score Table</Text>
      <FlatList
        data={games}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderGameRow}
        style={styles.gameTable}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 44,
  },
  topButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  button: {
    padding: 10,
    backgroundColor: 'lightgray',
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 16,
  },
  scoreText: {
    fontSize: 24,
    marginVertical: 10,
  },
  gameText: {
    fontSize: 24,
    marginVertical: 10,
  },
  tableText: {
    fontSize: 24,
    marginVertical: 10,
  },
  badmintonCourt: {
    width: '100%',
    height: '21%',
    resizeMode: 'cover',
  },
  playerSymbol: {
    width: 55,
    height: 55,
    position: 'absolute',
    resizeMode: 'center',
  },
  badmintonBirdie: {
    width: 55,
    height: 55,
    position: 'absolute',
    resizeMode: 'center',
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
  },
  scoreColumn: {
    alignItems: 'center',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  score: {
    fontSize: 28,
    marginHorizontal: 8,
  },
  roundButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameTable: {
    width: '100%',
    marginTop: 20,
  },
  gameTableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'black',
  },
  gameTableCell: {
    flex: 1,
    padding: 8,
    textAlign: 'center',
  },
});

export default SingleGameNormal;