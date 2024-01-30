import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Image,
  SafeAreaView,
} from 'react-native';
import { getDocs, collection } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

import { firestore, storage } from './config';

const nameColors = ['#FF5733', '#E42C64', '#4A90E2', '#33D9B2', '#A593E0'];

export function Rank({ navigation }) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedMode, setSelectedMode] = useState(null);
  const [isSinglePlayerMode, setSinglePlayerMode] = useState(false);
  const [sortBy, setSortBy] = useState('wins');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [imgUrls, setImgUrls] = useState([]);

  const calculateWinRate = (wins, matchesPlayed) => {
    if (matchesPlayed === 0) {
      return 0;
    }
    return (wins / matchesPlayed) * 100;
  };

  const calculatePointDifference = (roundsWon, roundsLost) => {
    return roundsWon - roundsLost;
  };

  const sortLeaderboard = (data, sortBy) => {
    if (sortBy === 'wins') {
      return data.sort((a, b) => (b.wins || 0) - (a.wins || 0));
    } else if (sortBy === 'winRate') {
      return data.sort((a, b) => (b.winRate || 0) - (a.winRate || 0));
    } else if (sortBy === 'pointDifference') {
      return data.sort((a, b) => (b.pointDifference || 0) - (a.pointDifference || 0));
    }
  };

  const fetchDataFromFirebase = async () => {
    try {
      const usersCollection = collection(firestore, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const leaderboardArray = usersSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      const updatedLeaderboardData = leaderboardArray.map((item) => {
        const winRate = calculateWinRate(item.wins, item.matchesPlayed);
        const pointDifference = calculatePointDifference(item.roundsWon, item.roundsLost);
        return { ...item, winRate, pointDifference };
      });

      const sortedLeaderboard = sortLeaderboard(updatedLeaderboardData, sortBy);

      const imageUrls = await Promise.all(
        sortedLeaderboard.map(async (user) => {
          try {
            const imageRef = ref(storage, `${user.id}.jpg`);
            const doesExist = await imageExists(imageRef);

            if (doesExist) {
              const imageUrl = await getDownloadURL(imageRef);
              console.log(`Image URL for ${user.id}: ${imageUrl}`);
              return imageUrl;
            } else {
              console.warn(`Image does not exist for ${user.id}`);
              return '';
            }
          } catch (error) {
            console.error(`Error fetching image URL for ${user.id}:`, error);
            return '';
          }
        })
      );

      console.log('Image URLs:', imageUrls);

      setImgUrls(imageUrls);
      setLeaderboardData(sortedLeaderboard);
    } catch (error) {
      console.error('Error fetching data from Firebase:', error);
    }
  };

  const imageExists = async (imageRef) => {
    try {
      await getDownloadURL(imageRef);
      return true;
    } catch (error) {
      if (error.code === 'storage/object-not-found') {
        return false;
      }
      throw error;
    }
  };

  useEffect(() => {
    fetchDataFromFirebase();
  }, [sortBy]);

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
    setSelectedMode(null);
  };

  const handleCreateGame = () => {
    let gameMode;
  
    if (selectedMode === 'normal') {
      gameMode = isSinglePlayerMode ? 'CreateSingleGameNormalMode' : 'CreateMultiplayerNormalMode';
    } else if (selectedMode === 'training') {
      gameMode = isSinglePlayerMode ? 'CreateSingleGamePracticeMode' : 'CreateMultiplayerPracticeMode';
    }
  
    console.log('Before navigation and toggleModal');
    console.log('Selected Mode:', selectedMode);
  
    if (gameMode) {
      console.log(`Creating game in ${selectedMode} mode for ${isSinglePlayerMode ? 'Single' : 'Multi'}`);
      navigation.navigate(gameMode);
      toggleModal();
    } else {
      // Don't log a warning, simply return without doing anything
      return;
    }
  
    console.log('After navigation and toggleModal');
  };
  
  
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.createSingleGameButton}
          onPress={() => {
            setSinglePlayerMode(true);
            toggleModal();
          }}
        >
          <Text style={styles.buttonText}>Create Single Game</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.createMultiplayerButton}
          onPress={() => {
            setSinglePlayerMode(false);
            toggleModal();
          }}
        >
          <Text style={styles.buttonText}>Create Multiplayer Game</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.leaderboardTitle}>Leaderboard</Text>

      <View style={styles.sortButtonsContainer}>
        <TouchableOpacity
          style={[styles.sortButton, sortBy === 'wins' && styles.activeSortButton]}
          onPress={() => handleSortChange('wins')}
        >
          <Text style={styles.sortButtonText}>Wins</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.sortButton, sortBy === 'winRate' && styles.activeSortButton]}
          onPress={() => handleSortChange('winRate')}
        >
          <Text style={styles.sortButtonText}>Win Rate</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.sortButton, sortBy === 'pointDifference' && styles.activeSortButton]}
          onPress={() => handleSortChange('pointDifference')}
        >
          <Text style={styles.sortButtonText}>Point Difference</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.leaderboardContainer}>
        {renderLeaderboard(leaderboardData, imgUrls)}
      </ScrollView>

      <Modal
  visible={isModalVisible}
  transparent={true}
  animationType="slide"
  onRequestClose={toggleModal}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalButtonsContainer}>
      <TouchableOpacity
        style={[styles.sortButton, styles.singlePlayerButton]}
        onPress={() => {
          setSelectedMode('normal');
          handleCreateGame(); // เพิ่มการเรียกใช้ handleCreateGame ที่นี่
        }}
      >
        <Text style={styles.sortButtonText}>
          Normal {isSinglePlayerMode ? '- Single' : '- Multi'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.sortButton, styles.trainingButton]}
        onPress={() => {
          setSelectedMode('training');
          handleCreateGame(); // เพิ่มการเรียกใช้ handleCreateGame ที่นี่
        }}
      >
        <Text style={styles.sortButtonText}>
          Training {isSinglePlayerMode ? '- Single' : '- Multi'}
        </Text>
      </TouchableOpacity>
    </View>
    <TouchableOpacity
      style={[styles.sortButton, styles.closeButton]}
      onPress={toggleModal}
    >
      <Text style={styles.sortButtonText}>Close</Text>
    </TouchableOpacity>
  </View>
</Modal>
    </SafeAreaView>
  );
}

const renderLeaderboard = (data, imgUrls) => {
  return (
    <>
      {data.map((value, index) => (
        <View style={styles.leaderboardItem} key={index}>
          <View
            style={[
              styles.leaderboardItemHeader,
              { backgroundColor: nameColors[index % nameColors.length] },
            ]}
          >
            <Image
              source={
                imgUrls && imgUrls[index]
                  ? { uri: imgUrls[index] }
                  : require('./profile.png')
              }
              style={styles.leaderboardItemImage}
            />
            <View style={styles.leaderboardItemInfoContainer}>
              <Text style={styles.darkText}>
                {truncateText(value.name, 20)}
              </Text>
              <Text style={styles.winText}>Wins: {value.wins}</Text>
              <Text>{value.description}</Text>
            </View>
          </View>
          <View style={styles.leaderboardItemStats}>
            <View style={styles.leaderboardItemStat}>
              <Text style={styles.leaderboardItemStatLabel}>
                Win Rate: {value.winRate.toFixed(2)}%
              </Text>
            </View>
            <View style={styles.leaderboardItemStat}>
              <Text style={styles.leaderboardItemStatLabel}>
                R Won: {value.roundsWon}
              </Text>
            </View>
            <View style={styles.leaderboardItemStat}>
              <Text style={styles.leaderboardItemStatLabel}>
                R Lost: {value.roundsLost}
              </Text>
            </View>
            <View style={styles.leaderboardItemStat}>
              <Text style={styles.leaderboardItemStatLabel}>
                Point Diff: {value.pointDifference}
              </Text>
            </View>
          </View>
        </View>
      ))}
    </>
  );
};

const truncateText = (text, maxLength) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  }
  return text;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  createSingleGameButton: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createMultiplayerButton: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  leaderboardTitle: {
    marginBottom: 8,
    fontSize: 24,
    color: '#333',
    textAlign: 'center',  // Center the text horizontally
    alignSelf: 'center',  // Center the text vertically
  },
  sortButtonsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    justifyContent: 'center',
  },
  sortButton: {
    backgroundColor: '#DDDDDD',
    padding: 12,
    marginHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeSortButton: {
    backgroundColor: '#297FB8',
  },
  sortButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  leaderboardContainer: {
    marginTop: 16,
  },
  leaderboardItem: {
    flexDirection: 'column',
    marginBottom: 32,
  },
  leaderboardItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    padding: 8,
  },
  leaderboardItemImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  leaderboardItemInfoContainer: {
    marginLeft: 8,
  },
  darkText: {
    color: 'white',
    fontSize: 16,
  },
  leaderboardItemStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  leaderboardItemStat: {
    backgroundColor: '#ECECEC',
    padding: 4,
    borderRadius: 4,
    minWidth: 80,
    alignItems: 'center',
  },
  leaderboardItemStatLabel: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  winText: {
    marginLeft: 'auto',
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  singlePlayerButton: {
    marginRight: 10,
    backgroundColor: 'green',
  },
  trainingButton: {
    backgroundColor: 'blue',
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: 'red',
  },
});

export default Rank;
