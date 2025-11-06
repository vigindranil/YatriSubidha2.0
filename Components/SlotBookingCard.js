import { Pressable, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { FontAwesome6 } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const SlotBookingCard = ({ slot, intendedDate,journeyType  }) => {
    const navigation = useNavigation();

    const totalCapacity = Number(slot.capacity || 0);
    const bookedCount = Number(slot.slot_count || 0);
    const availableCount = Math.max(0, totalCapacity - bookedCount);
    const occupancyPct = totalCapacity > 0 ? Math.min(100, Math.max(0, Math.round((bookedCount / totalCapacity) * 100))) : 0;
    const isFull = availableCount === 0 || bookedCount >= totalCapacity;

    return (
        <LinearGradient
            colors={['#5b6dff', '#7b9bff']}
            start={[0, 0]}
            end={[1, 1]}
            style={styles.card}
        >
            {/* Header */}
            <View style={styles.headerRow}>
                <Text style={styles.slotTitle}>{slot.name}</Text>
                <View style={[styles.badge, { backgroundColor: isFull ? 'rgba(255, 77, 79, 0.25)' : 'rgba(82, 196, 26, 0.25)' }]}>
                    <Text style={[styles.badgeText, { color: isFull ? '#ff4d4f' : '#52c41a' }]}>
                        {isFull ? 'Full' : 'Available'}
                    </Text>
                </View>
            </View>

            {/* Stats row */}
            <View style={styles.statsRow}>
                <View style={styles.statChip}>
                    <Text style={styles.statLabel}>Total</Text>
                    <View style={styles.statValueBox}>
                        <Text style={styles.statValue}>{totalCapacity}</Text>
                        <FontAwesome6 name="user-group" size={11} color="#3a84ff" />
                    </View>
                </View>
                <View style={styles.statChip}>
                    <Text style={styles.statLabel}>Booked</Text>
                    <View style={styles.statValueBox}>
                        <Text style={styles.statValue}>{bookedCount}</Text>
                        <FontAwesome6 name="user-group" size={11} color="#ff4d4f" />
                    </View>
                </View>
                <View style={styles.statChip}>
                    <Text style={styles.statLabel}>Available</Text>
                    <View style={styles.statValueBox}>
                        <Text style={styles.statValue}>{availableCount}</Text>
                        <FontAwesome6 name="user-group" size={11} color="#52c41a" />
                    </View>
                </View>
            </View>

            {/* Progress bar */}
            <View style={styles.progressContainer}>
                <View style={styles.progressTrack}>
                    <View style={[
                        styles.progressFill,
                        { width: `${occupancyPct}%`, backgroundColor: isFull ? '#ff4d4f' : '#52c41a' }
                    ]} />
                </View>
                <Text style={styles.progressText}>{occupancyPct}% booked</Text>
            </View>

            {/* Footer row */}
            <View style={styles.footerRow}>
                <View style={styles.timePillWrapper}>
                    <Text style={styles.timeLabel}>Time</Text>
                    <View style={styles.timePill}>
                        <Text style={styles.timeText}>{slot.timing}</Text>
                    </View>
                </View>
                {isFull ? (
                    <View style={[styles.ctaDisabled, { backgroundColor: '#ff7875' }]}>
                        <Text style={styles.ctaDisabledText}>Fully Occupied</Text>
                    </View>
                ) : (
                    <TouchableOpacity
                        onPress={() => navigation.navigate('SlotBookFormScreen', { slotId: slot.id, slot: slot.name, slotTime: slot.timing, bookingDate: intendedDate ,journeyType:journeyType })}
                        style={styles.ctaButton}
                        activeOpacity={0.9}
                    >
                        <Text style={styles.ctaButtonText}>Select Slot</Text>
                        <AntDesign name="arrowright" size={18} color="#102a43" style={{ marginLeft: 6 }} />
                    </TouchableOpacity>
                )}
            </View>
        </LinearGradient>
    )
}

export default SlotBookingCard

const styles = StyleSheet.create({
    card: {
        width: '100%',
        borderRadius: 12,
        marginTop: 12,
        paddingVertical: 14,
        paddingHorizontal: 12,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 12,
        elevation: 4,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    slotTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '800',
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '700',
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 14,
        marginBottom: 8,
    },
    statChip: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        flex: 1,
    },
    statLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.85)',
        marginBottom: 4,
        fontWeight: '600',
    },
    statValueBox: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 26,
        minWidth: 64,
        borderRadius: 16,
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.95)',
        paddingHorizontal: 10,
        alignSelf: 'flex-start',
    },
    statValue: {
        fontSize: 12,
        fontWeight: '800',
        color: '#334e68',
        marginRight: 6,
    },
    progressContainer: {
        marginTop: 6,
        marginBottom: 8,
    },
    progressTrack: {
        width: '100%',
        height: 8,
        borderRadius: 999,
        backgroundColor: 'rgba(255,255,255,0.35)',
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 999,
    },
    progressText: {
        marginTop: 6,
        color: 'rgba(255,255,255,0.9)',
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'right',
    },
    footerRow: {
        marginTop: 6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    timePillWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 2,
    },
    timeLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: 'rgba(255,255,255,0.95)',
        marginRight: 8,
    },
    timePill: {
        height: 26,
        minWidth: 140,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.96)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
    },
    timeText: {
        fontSize: 12,
        fontWeight: '800',
        color: '#334e68',
    },
    ctaDisabled: {
        height: 34,
        minWidth: 130,
        borderRadius: 18,
        marginRight: 6,
        marginTop: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    ctaDisabledText: {
        fontSize: 13,
        fontWeight: '800',
        color: '#fff',
    },
    ctaButton: {
        height: 34,
        minWidth: 130,
        borderRadius: 18,
        marginRight: 6,
        marginTop: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffe58f',
        paddingHorizontal: 14,
    },
    ctaButtonText: {
        fontSize: 13,
        fontWeight: '800',
        color: '#102a43',
    },
})