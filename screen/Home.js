import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions, FlatList, TouchableWithoutFeedback } from 'react-native';
import Swiper from 'react-native-swiper';
import moment from 'moment';
import { format, addDays, isSameDay } from 'date-fns';
import { db, auth, collection, query, where, getDocs, orderBy } from '../firebaseConfig';
import { useNavigation, useFocusEffect } from '@react-navigation/native'; 
import Cards from "./Cards";
import { AntDesign } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function Home() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [lists, setLists] = useState([]);
    const [week, setWeek] = useState(0);
    const [user, setUser] = useState(null);
    const navigation = useNavigation();
    const swiper = useRef(null);

    useFocusEffect(
        React.useCallback(() => {
            if (user) fetchListsForDate(user.uid, selectedDate);
        }, [user, selectedDate])
    );

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
            if (currentUser) fetchListsForDate(currentUser.uid, selectedDate);
        });
        return () => unsubscribe();
    }, []);

    const fetchListsForDate = async (userId, date) => {
        const listsQuery = query(
            collection(db, 'userid'), // Corrected collection name
            where('userId', '==', userId),
            where('date', '>=', moment(date).startOf('day').toDate()),
            where('date', '<=', moment(date).endOf('day').toDate()),
            orderBy('date', 'desc')
        );
        const querySnapshot = await getDocs(listsQuery);
        setLists(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    const weeks = React.useMemo(() => {
        const start = moment().add(week, 'weeks').startOf('week');
        return [-1, 0, 1].map(adj => {
            return Array.from({ length: 7 }).map((_, index) => {
                const date = moment(start).add(adj, 'week').add(index, 'day');
                return {
                    weekday: date.format('ddd'),
                    date: date.toDate(),
                };
            });
        });
    }, [week]);

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>My Schedule</Text>
            <Swiper
                index={1}
                ref={swiper}
                loop={false}
                showsPagination={false}
                onIndexChanged={ind => {
                    if (ind === 1) return;
                    const index = ind - 1;
                    setSelectedDate(moment(selectedDate).add(index, 'week').toDate());
                    setTimeout(() => {
                        setWeek(week + index);
                        swiper.current.scrollTo(1, false);
                    }, 10);
                }}>
                {weeks.map((dates, index) => (
                    <View style={styles.itemRow} key={index}>
                        {dates.map((item, dateIndex) => {
                            const isActive = isSameDay(selectedDate, item.date);
                            return (
                                <TouchableWithoutFeedback
                                    key={dateIndex}
                                    onPress={() => setSelectedDate(item.date)}>
                                    <View style={[styles.item, isActive && styles.activeItem]}>
                                        <Text style={[styles.itemWeekday, isActive && styles.activeText]}>
                                            {item.weekday}
                                        </Text>
                                        <Text style={[styles.itemDate, isActive && styles.activeText]}>
                                            {item.date.getDate()}
                                        </Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            );
                        })}
                    </View>
                ))}
            </Swiper>

            <View style={styles.listsContainer}>
                <Text style={styles.listsTitle}>Lists for {format(selectedDate, 'PPPP')}</Text>
                <Cards selectedDate={selectedDate} />
            </View>

            <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddListModal')}>
                <AntDesign name="plus" size={24} color="white" />
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    title: { 
        fontSize: 25,
        fontWeight: '600',
        padding: 16,
        textAlign: 'center',
    },
    listsContainer: {
        flex: 1,
        padding: 16,
        marginTop: -80, 
    },
    listsTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 9,
        marginTop: -140,
    },
    addButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#F5B7B1',
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 10,
    },
    item: {
        alignItems: 'center',
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    activeItem: {
        backgroundColor: '#F5B7B1',
        borderColor: '#F5B7B1',
    },
    itemWeekday: {
        fontSize: 14,
        color: '#333',
    },
    itemDate: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    activeText: {
        color: '#fff',
    },
});
