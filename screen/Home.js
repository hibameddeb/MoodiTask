import React, { useState, useEffect } from 'react';
import { 
    View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Dimensions 
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import Carousel from 'react-native-reanimated-carousel';
import { db, auth, collection, query, where, getDocs, orderBy } from '../firebaseConfig';
import { useNavigation, useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect
const { width } = Dimensions.get('window');

export default function Home() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [lists, setLists] = useState([]);
    const [user, setUser] = useState(null);
    const navigation = useNavigation();

    
    useFocusEffect(
        React.useCallback(() => {
            if (user) {
                fetchListsForDate(user.uid, selectedDate);
            }
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
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const listsQuery = query(
            collection(db, 'userId'),
            where('userId', '==', userId),
            where('date', '>=', startOfDay),
            where('date', '<=', endOfDay),
            orderBy('date', 'desc')
        );
        const querySnapshot = await getDocs(listsQuery);
        setLists(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        if (user) fetchListsForDate(user.uid, date);
    };

    const renderCalendarItem = ({ item }) => {
        const isActive = isSameDay(selectedDate, item.date);
        return (
            <TouchableOpacity
                key={item.date.toString()} // Add a unique key
                style={[styles.calendarItem, isActive && styles.activeCalendarItem]}
                onPress={() => handleDateSelect(item.date)}
            >
                <Text style={[styles.calendarDay, isActive && styles.activeCalendarDay]}>{item.weekday}</Text>
                <Text style={[styles.calendarDate, isActive && styles.activeCalendarDate]}>{item.date.getDate()}</Text>
            </TouchableOpacity>
        );
    };

    const renderListItem = ({ item }) => (
        <View style={styles.listItem}>
            <Text style={styles.listTitle}>{item.name}</Text>
            <Text style={styles.listDate}>{format(item.createdAt.toDate(), 'PPPP')}</Text>
        </View>
    );

    const weekDays = Array.from({ length: 7 }).map((_, index) => {
        const date = addDays(startOfWeek(new Date()), index);
        return {
            weekday: format(date, 'EEE'),
            date,
        };
    });

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Your Schedule</Text>
            </View>

            <Carousel
                width={width}
                height={100}
                data={[weekDays]} 
                loop={false}
                defaultIndex={0} 
                renderItem={({ item }) => (
                    <View style={styles.calendarRow}>
                        {item.map((day, index) => renderCalendarItem({ item: day, index }))}
                    </View>
                )}
            />

            <View style={styles.listsContainer}>
                <Text style={styles.listsTitle}>Lists for {format(selectedDate, 'PPPP')}</Text>
                <FlatList
                    data={lists}
                    keyExtractor={(item) => item.id.toString()} 
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => renderListItem(item)} 
                    keyboardShouldPersistTaps="always"        
                />
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
        marginTop: "-380"
    },
    listsTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 16,
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