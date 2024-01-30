import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  Modal,
} from 'react-native';
import ModalSelector from 'react-native-modal-selector';
import firestore from './config'; // Import firestore from your firebase.js file

export function MultiplayerGamePracticeMode() {
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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisible2, setIsModalVisible2] = useState(false);

  useEffect(() => {
    if (player1Score === 21 || player2Score === 21) {
      if (Math.abs(player1Score - player2Score) >= 2) {
        handleGameWon(player1Score > player2Score ? 1 : 2);

        if (gameNumber === totalGames) {
          alert(
            'Game over! Player ' +
              (player1Score > player2Score ? '1' : '2') +
              ' wins!'
          );
        } else {
          setGameNumber(gameNumber + 1);
          setPlayer1Score(0);
          setPlayer2Score(0);
          setIsPlayer1Serving(!isPlayer1Serving); // สลับผู้เสิร์ฟเมื่อเกมใหม่เริ่ม
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
    // ตรวจสอบว่าฝ่ายไหนชนะในเกมแรกและตัดสินใจให้ฝ่ายไหนเริ่มเสิร์ฟในเกมต่อไป
    const winnerServesNext = player1GamesWon > player2GamesWon ? 1 : 2;

    // แก้ไขส่วนนี้
    if (winnerServesNext === 1) {
      setIsPlayer1Serving(true);
    } else {
      setIsPlayer1Serving(false);
    }

    setPlayer1Score(0);
    setPlayer2Score(0);
    setGameNumber(1);
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
  };

  const updateGameScore = (player, score1, score2) => {
    const gameScore = { ...game1Score };

    if (gameNumber === 1) {
      gameScore.player1 = score1;
      gameScore.player2 = score2;
      setGame1Score(gameScore);
    } else if (gameNumber === 2) {
      gameScore.player1 = score1;
      gameScore.player2 = score2;
      setGame2Score(gameScore);
    } else if (gameNumber === 3) {
      gameScore.player1 = score1;
      gameScore.player2 = score2;
      setGame3Score(gameScore);
    }
  };

  const decreaseScore = (player) => {
    if (player === 1 && player1Score > 0) {
      setPlayer1Score(player1Score - 1);
    } else if (player === 2 && player2Score > 0) {
      setPlayer2Score(player2Score - 1);
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
      name: 'Duo 1',
      gamesWon: player1GamesWon,
      game1: game1Score.player1,
      game2: game2Score.player1,
      game3: game3Score.player1,
    },
    {
      name: 'Duo 2',
      gamesWon: player2GamesWon,
      game1: game1Score.player2,
      game2: game2Score.player2,
      game3: game3Score.player2,
    },
  ];
  const showOptionsModal = () => {
    setIsModalVisible(true);
  };

  const showOptionsModal2 = () => {
    setIsModalVisible2(true);
  };

  const hideOptionsModal = () => {
    setIsModalVisible(false);
  };

  const hideOptionsModal2 = () => {
    setIsModalVisible2(false);
  };

  const handleOptionSelect = (option) => {
    console.log('Selected option:', option.label);
    hideOptionsModal();
  
    // เพิ่มเงื่อนไขสำหรับลูกเสิร์ฟ (serve)
    if (option.label === 'ลูกเสิร์ฟ','ลูกออก','ลูกตบ','ลูกหยอด/วาง','ลูกเสีย') {
      increaseScore(1);
    }
  };
  const handleOptionSelect2 = (option) => {
    console.log('Selected option:', option.label);
    hideOptionsModal();
  
    // เพิ่มเงื่อนไขสำหรับลูกเสิร์ฟ (serve)
    if (option.label === 'ลูกเสิร์ฟ','ลูกออก','ลูกตบ','ลูกหยอด/วาง','ลูกเสีย') {
      increaseScore(2);
    }
  };
  const options = [
    { key: 1, label: 'ลูกเสิร์ฟ' },
    { key: 2, label: 'ลูกออก' },
    { key: 3, label: 'ลูกตบ' },
    { key: 4, label: 'ลูกหยอด/วาง' },
    { key: 5, label: 'ลูกเสีย' },
  ];

  const options2 = [
    { key: 1, label: 'ลูกเสิร์ฟ' },
    { key: 2, label: 'ลูกออก' },
    { key: 3, label: 'ลูกตบ' },
    { key: 4, label: 'ลูกหยอด/วาง' },
    { key: 5, label: 'ลูกเสีย' },
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
              <Text style={styles.scoreText}>Duo 1:</Text>
              <View style={styles.scoreRow}>
              <TouchableOpacity
        style={[styles.roundButton, { backgroundColor: 'green' }]}
        onPress={showOptionsModal}>
        <Text
          style={[
            styles.buttonText,
            { color: 'white', fontWeight: 'bold' },
          ]}>
          +
        </Text>
      </TouchableOpacity>

      {/* Modal เลือกตัวเลือก */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={hideOptionsModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ModalSelector
              data={options}
              initValue="เลือรายละเอียดคะแนน"
              onChange={handleOptionSelect}
            />
          </View>
        </View>
      </Modal>
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
              <Text style={styles.scoreText}>Duo 2:</Text>
              <View style={styles.scoreRow}>
              <TouchableOpacity
        style={[styles.roundButton, { backgroundColor: 'green' }]}
        onPress={showOptionsModal2}>
        <Text
          style={[
            styles.buttonText,
            { color: 'white', fontWeight: 'bold' },
          ]}>
          +
        </Text>
      </TouchableOpacity>

      {/* Modal เลือกตัวเลือก */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible2}
        onRequestClose={hideOptionsModal2}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ModalSelector
              data={options2}
              initValue="เลือรายละเอียดคะแนน"
              onChange={handleOptionSelect2}
            />
          </View>
        </View>
      </Modal>
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
              <Text style={styles.scoreText}>Duo 1:</Text>
              <View style={styles.scoreRow}>
              <TouchableOpacity
        style={[styles.roundButton, { backgroundColor: 'green' }]}
        onPress={showOptionsModal}>
        <Text
          style={[
            styles.buttonText,
            { color: 'white', fontWeight: 'bold' },
          ]}>
          +
        </Text>
      </TouchableOpacity>

      {/* Modal เลือกตัวเลือก */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={hideOptionsModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ModalSelector
              data={options}
              initValue="เลือรายละเอียดคะแนน"
              onChange={handleOptionSelect}
            />
          </View>
        </View>
      </Modal>
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
              <Text style={styles.scoreText}>Duo 2:</Text>
              <View style={styles.scoreRow}>
              <TouchableOpacity
        style={[styles.roundButton, { backgroundColor: 'green' }]}
        onPress={showOptionsModal2}>
        <Text
          style={[
            styles.buttonText,
            { color: 'white', fontWeight: 'bold' },
          ]}>
          +
        </Text>
      </TouchableOpacity>

      {/* Modal เลือกตัวเลือก */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible2}
        onRequestClose={hideOptionsModal2}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ModalSelector
              data={options2}
              initValue="เลือรายละเอียดคะแนน"
              onChange={handleOptionSelect2}
            />
          </View>
        </View>
      </Modal>
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
              <Text style={styles.scoreText}>Duo 1:</Text>
              <View style={styles.scoreRow}>
              <TouchableOpacity
        style={[styles.roundButton, { backgroundColor: 'green' }]}
        onPress={showOptionsModal}>
        <Text
          style={[
            styles.buttonText,
            { color: 'white', fontWeight: 'bold' },
          ]}>
          +
        </Text>
      </TouchableOpacity>

      {/* Modal เลือกตัวเลือก */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={hideOptionsModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ModalSelector
              data={options}
              initValue="เลือรายละเอียดคะแนน"
              onChange={handleOptionSelect}
            />
          </View>
        </View>
      </Modal>
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
              <Text style={styles.scoreText}>Duo 2:</Text>
              <View style={styles.scoreRow}>
              <TouchableOpacity
        style={[styles.roundButton, { backgroundColor: 'green' }]}
        onPress={showOptionsModal2}>
        <Text
          style={[
            styles.buttonText,
            { color: 'white', fontWeight: 'bold' },
          ]}>
          +
        </Text>
      </TouchableOpacity>

      {/* Modal เลือกตัวเลือก */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible2}
        onRequestClose={hideOptionsModal2}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ModalSelector
              data={options2}
              initValue="เลือรายละเอียดคะแนน"
              onChange={handleOptionSelect2}
            />
          </View>
        </View>
      </Modal>
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
        source={require('./player_symbol.png')} //ผู้เล่นคนที่ 1
        style={[
          styles.playerSymbol,
          {
            top: '35%',
            left: '15%',
            opacity: gameNumber === 1 ? 1 : 0, // แสดงในเกม 1
          },
        ]}
      />
      <Image
        source={require('./player_symbol.png')} //ผู้เล่นคนที่ 1
        style={[
          styles.playerSymbol,
          {
            top: '27%',
            left: '73%',
            opacity: gameNumber === 2 ? 1 : 0, // แสดงในเกม 2
          },
        ]}
      />
      <Image
        source={require('./player_symbol.png')} //ผู้เล่นคนที่ 1
        style={[
          styles.playerSymbol,
          {
            top: '35%',
            left: '15%',
            opacity: gameNumber === 3 ? 1 : 0, // แสดงในเกม 3
          },
        ]}
      />
      <Image
        source={require('./player_symbol2.png')} //ผู้เล่นคนที่ 2
        style={[
          styles.playerSymbol,
          {
            top: '27%',
            left: '15%',
            opacity: gameNumber === 1 ? 1 : 0, // แสดงในเกม 1
          },
        ]}
      />
      <Image
        source={require('./player_symbol2.png')} //ผู้เล่นคนที่ 2
        style={[
          styles.playerSymbol,
          {
            top: '35%',
            left: '73%',
            opacity: gameNumber === 2 ? 1 : 0, // แสดงในเกม 2
          },
        ]}
      />
      <Image
        source={require('./player_symbol2.png')} //ผู้เล่นคนที่ 2
        style={[
          styles.playerSymbol,
          {
            top: '27%',
            left: '15%',
            opacity: gameNumber === 3 ? 1 : 0, // แสดงในเกม 3
          },
        ]}
      />
      <Image
        source={require('./player_symbol3.png')} //ผู้เล่นคนที่ 3
        style={[
          styles.playerSymbol,
          {
            top: '27%',
            left: '73%',
            opacity: gameNumber === 1 ? 1 : 0, // แสดงในเกม 1
          },
        ]}
      />
      <Image
        source={require('./player_symbol3.png')} //ผู้เล่นคนที่ 3
        style={[
          styles.playerSymbol,
          {
            top: '35%',
            left: '15%',
            opacity: gameNumber === 2 ? 1 : 0, // แสดงในเกม 2
          },
        ]}
      />
      <Image
        source={require('./player_symbol3.png')} //ผู้เล่นคนที่ 3
        style={[
          styles.playerSymbol,
          {
            top: '27%',
            left: '73%',
            opacity: gameNumber === 3 ? 1 : 0, // แสดงในเกม 3
          },
        ]}
      />
      <Image
        source={require('./player_symbol4.png')} //ผู้เล่นคนที่ 4
        style={[
          styles.playerSymbol,
          {
            top: '35%',
            left: '73%',
            opacity: gameNumber === 1 ? 1 : 0, // แสดงในเกม 1
          },
        ]}
      />
      <Image
        source={require('./player_symbol4.png')} //ผู้เล่นคนที่ 4
        style={[
          styles.playerSymbol,
          {
            top: '27%',
            left: '15%',
            opacity: gameNumber === 2 ? 1 : 0, // แสดงในเกม 2
          },
        ]}
      />
      <Image
        source={require('./player_symbol4.png')} //ผู้เล่นคนที่ 4
        style={[
          styles.playerSymbol,
          {
            top: '35%',
            left: '73%',
            opacity: gameNumber === 3 ? 1 : 0, // แสดงในเกม 3
          },
        ]}
      />
      <Text style={styles.servingText}>
        {isPlayer1Serving ? 'Duo 1 is serving' : 'Duo 2 is serving'}
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roundButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 200,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
});

export default MultiplayerGamePracticeMode;