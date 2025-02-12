import React, { useState, useRef } from 'react';
import { StyleSheet, Dimensions, TouchableWithoutFeedback, SafeAreaView, View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import { format, addWeeks, startOfWeek, addDays, subDays, isSameDay } from 'date-fns';
import Carousel from 'react-native-reanimated-carousel';
import Octicons from '@expo/vector-icons/Octicons';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import tempData from './tempData';
import Cards from './Cards';
import AddListModal from './AddListModal.js';

const { width } = Dimensions.get('window');

export default function Home() {
  const [week, setWeek] = useState(0);
  const navigation = useNavigation();
  const [value, setValue] = useState(new Date());
  const [addTodoVisible, setAddTodoVisible] = useState(false);
  const [list, setList] = useState(tempData);

  const toggleAddTodoModal = () => {
    setAddTodoVisible(!addTodoVisible);
  };

  const addList = (newList) => {
    const newItem = { ...newList, id: list.length + 1, Cards: [] };
    setList([...list, newItem]);
  };

  const updateList = (updatedList) => {
    setList(prevList => prevList.map(item => item.id === updatedList.id ? updatedList : item));
  };

  const renderList = (list) => <Cards list={list} updateList={updateList} />;

  const weeks = React.useMemo(() => {
    const start = startOfWeek(addWeeks(new Date(), week));

    return [-1, 0, 1].map(adj => {
      return Array.from({ length: 7 }).map((_, index) => {
        const date = addDays(addWeeks(start, adj), index);
        return {
          weekday: format(date, 'EEE'),
          date,
        };
      });
    });
  }, [week]);

  const days = React.useMemo(() => {
    return [subDays(value, 1), value, addDays(value, 1)];
  }, [value]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Schedule</Text>
        </View>

        <View style={styles.picker}>
          <Carousel
            width={width}
            height={74}
            data={weeks}
            loop={false}
            defaultIndex={1}
            onSnapToItem={(index) => {
              if (index !== 1) {
                const newWeek = week + (index - 1);
                setWeek(newWeek);
                setValue(addWeeks(value, index - 1));
              }
            }}
            renderItem={({ item }) => (
              <View style={styles.itemRow}>
                {item.map((day, dateIndex) => {
                  const isActive = isSameDay(value, day.date);
                  return (
                    <TouchableWithoutFeedback key={dateIndex} onPress={() => setValue(day.date)}>
                      <View style={[styles.item, isActive && { backgroundColor: '#111', borderColor: '#111' }]}>
                        <Text style={[styles.itemWeekday, isActive && { color: '#fff' }]}>{day.weekday}</Text>
                        <Text style={[styles.itemDate, isActive && { color: '#fff' }]}>{day.date.getDate()}</Text>
                      </View>
                    </TouchableWithoutFeedback>
                  );
                })}
              </View>
            )}
          />
        </View>

        <Carousel
          width={width}
          height={300}
          data={days}
          loop={false}
          defaultIndex={1}
          onSnapToItem={(index) => {
            const nextValue = addDays(value, index - 1);
            setValue(nextValue);
            if (format(value, 'w') !== format(nextValue, 'w')) {
              setWeek(format(value, 'w') < format(nextValue, 'w') ? week + 1 : week - 1);
            }
          }}
          renderItem={({ item }) => (
            <View style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 24 }}>
              <Text style={styles.subtitle}>{format(item, 'EEEE, MMMM d, yyyy')}</Text>
              <View style={styles.placeholder}>
                <View style={styles.placeholderInset}>
                  <View style={styles.container}>
                    <Modal visible={addTodoVisible}  animationType="slide" onRequestClose={toggleAddTodoModal}>
                      <View style={styles.modalContainer}>
                        <AddListModal closeModal={toggleAddTodoModal} addList={addList} />
                      </View>
                    </Modal>

                    <View style={{ flexDirection: 'row' }}>
                      <View style={styles.divider} />
                      <Text style={styles.title}>To-Do List</Text>
                      <View style={styles.divider} />
                    </View>

                    <View style={{  alignItems:"center",justifyContent: "flex-end", }}>
                      <TouchableOpacity style={styles.addlist} onPress={toggleAddTodoModal}>
                        <AntDesign name="plus" size={16} color={"#0080ff"}paddingVertical="10" />
                      </TouchableOpacity>
                      <Text style={styles.add}>Add List</Text>
                      <TouchableOpacity style={styles.addlist} onPress={()=> navigation.navigate('Cards')}>
                        <Octicons name="checklist" size={24} color="black" paddingVertical="10"/>
                      </TouchableOpacity>
                      <Text style={styles.add}>See you're lists</Text>
                    </View>

                  </View>
                </View>


              </View>
            </View>


          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 24
  },
  header: {
    paddingHorizontal: 16
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1d1d1d',
    marginBottom: 12
  },
  picker: { flex: 1, maxHeight: 74, paddingVertical: 12, flexDirection: 'row', alignItems: 'center' },
  subtitle: { fontSize: 17, fontWeight: '600', color: '#999999', marginBottom: 12 },
  item: { flex: 1, height: 50, marginHorizontal: 4, paddingVertical: 6, paddingHorizontal: 4, borderWidth: 1, borderRadius: 8, borderColor: '#e3e3e3', flexDirection: 'column', alignItems: 'center' },
  itemRow: { width, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingHorizontal: 12 },
  itemWeekday: { fontSize: 13, fontWeight: '500', color: '#737373', marginBottom: 4 },
  itemDate: { fontSize: 15, fontWeight: '600', color: '#111' },
  placeholder: { flexGrow: 1, flexShrink: 1, flexBasis: 0, height: 400, backgroundColor: 'transparent' },
  placeholderInset: { borderWidth: 4, borderColor: '#e5e7eb', borderStyle: 'dashed', borderRadius: 9, flexGrow: 1, flexShrink: 1, flexBasis: 0 },
});

