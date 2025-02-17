import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import Swiper from 'react-native-swiper';
import { format, addDays ,isSameDay} from 'date-fns';
import { db, auth, collection, query, where, getDocs, orderBy } from '../firebaseConfig';
import { useNavigation, useFocusEffect } from '@react-navigation/native'; 
import Cards from "./Cards";
import { AntDesign } from '@expo/vector-icons';
const { width } = Dimensions.get('window');

export default function Home() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [lists, setLists] = useState([]);
    const [user, setUser] = useState(null);
    const navigation = useNavigation();
    const [weekOffset, setWeekOffset] = useState(0);

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
            collection(db, 'userId'),
            where('userId', '==', userId),
            where('date', '>=', date),
            where('date', '<=', addDays(date, 1)),
            orderBy('date', 'desc')
        );
        const querySnapshot = await getDocs(listsQuery);
        setLists(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    const getWeekDays = (offset) => {
        return Array.from({ length: 7 }).map((_, index) => {
            const date = addDays(new Date(), index + offset * 7);
            return { weekday: format(date, 'EEE'), date };
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>My Schedule</Text>
            <Swiper
                width={width}
                height={100}
                loop={false}
                 showsPagination={false} 
                onIndexChanged={(index) => setWeekOffset(index)}>
                {[...Array(52)].map((_, index) => (
                    <View key={index} style={styles.calendarRow}>
                        {getWeekDays(index).map((day) => (
                            <TouchableOpacity
                                key={day.date.toString()}
                                style={[styles.calendarItem, isSameDay(selectedDate, day.date) && styles.activeCalendarItem]}
                                onPress={() => setSelectedDate(day.date)}>
                                <Text style={[styles.calendarDay, isSameDay(selectedDate, day.date) && styles.activeCalendarDay]}>{day.weekday}</Text>
                                <Text style={[styles.calendarDate, isSameDay(selectedDate, day.date) && styles.activeCalendarDate]}>{day.date.getDate()}</Text>
                            </TouchableOpacity>
                        ))}
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
         fontWeight:'600', 
         padding: 16,
        textAlign: 'center' 
    },
    header: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    calendarRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    calendarItem: {
        alignItems: 'center',
        padding: 8,
        borderRadius: 8,
    },
    activeCalendarItem: {
        backgroundColor: '#007AFF',
    },
    calendarDay: {
        fontSize: 14,
        color: '#333',
    },
    activeCalendarDay: {
        color: '#fff',
    },
    calendarDate: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    activeCalendarDate: {
        color: '#fff',
    },
    listsContainer: {
        flex: 1,
        padding: 16,
        marginTop: "-480"
    },
    listsTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 9,
        marginTop:10
    },
    listItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    listTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    listDate: {
        fontSize: 14,
        color: '#666',
    },
    addButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#007AFF',
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
});