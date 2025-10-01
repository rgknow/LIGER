import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, ProgressBar, FAB } from 'react-native-paper';

interface StudentData {
  id: string;
  name: string;
  scs: number;
  walletBalance: number;
  recentActivity: string[];
  goals: Array<{
    title: string;
    progress: number;
    target: number;
  }>;
}

export default function DashboardScreen({ navigation }: any) {
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      // Mock data - in production, call LIGER API
      const mockData: StudentData = {
        id: 'student-1',
        name: 'Alice',
        scs: 75.5,
        walletBalance: 250.0,
        recentActivity: [
          'Completed weekly room cleaning (+25 CTK)',
          'Received birthday gift (+100 CTK)', 
          'Stock proposal approved (AAPL)',
          'Reading streak: 12 days'
        ],
        goals: [
          { title: 'First Investment Portfolio', progress: 250, target: 500 },
          { title: 'SCS Milestone (80+)', progress: 75.5, target: 80 },
          { title: 'Reading Challenge', progress: 12, target: 30 }
        ]
      };
      
      setStudentData(mockData);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch student data:', error);
      setLoading(false);
    }
  };

  if (loading || !studentData) {
    return (
      <View style={styles.container}>
        <Title>Loading...</Title>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Student Overview */}
        <Card style={styles.overviewCard}>
          <Card.Content>
            <Title>Welcome back, {studentData.name}! 🦁</Title>
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Title style={styles.statValue}>{studentData.scs}</Title>
                <Paragraph>Credibility Score</Paragraph>
              </View>
              <View style={styles.statBox}>
                <Title style={styles.statValue}>{studentData.walletBalance}</Title>
                <Paragraph>CTK Balance</Paragraph>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Goals Progress */}
        <Card style={styles.goalsCard}>
          <Card.Content>
            <Title>Your Goals 🎯</Title>
            {studentData.goals.map((goal, index) => (
              <View key={index} style={styles.goalItem}>
                <Paragraph style={styles.goalTitle}>{goal.title}</Paragraph>
                <View style={styles.progressRow}>
                  <ProgressBar 
                    progress={goal.progress / goal.target} 
                    color="#1976d2"
                    style={styles.progressBar}
                  />
                  <Paragraph style={styles.progressText}>
                    {goal.progress}/{goal.target}
                  </Paragraph>
                </View>
              </View>
            ))}
          </Card.Content>
        </Card>

        {/* Recent Activity */}
        <Card style={styles.activityCard}>
          <Card.Content>
            <Title>Recent Activity 📈</Title>
            {studentData.recentActivity.map((activity, index) => (
              <Paragraph key={index} style={styles.activityItem}>
                • {activity}
              </Paragraph>
            ))}
          </Card.Content>
        </Card>

        {/* Quick Actions */}
        <Card style={styles.actionsCard}>
          <Card.Content>
            <Title>Quick Actions</Title>
            <View style={styles.actionButtons}>
              <FAB
                style={[styles.actionFab, { backgroundColor: '#4caf50' }]}
                icon="plus"
                label="New Proposal"
                onPress={() => navigation.navigate('CreateProposal')}
              />
              <FAB
                style={[styles.actionFab, { backgroundColor: '#ff9800' }]}
                icon="gift"
                label="Gift Event"
                onPress={() => navigation.navigate('Gifts')}
              />
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  overviewCard: {
    marginBottom: 16,
    elevation: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  goalsCard: {
    marginBottom: 16,
    elevation: 2,
  },
  goalItem: {
    marginVertical: 8,
  },
  goalTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 8,
    marginRight: 12,
  },
  progressText: {
    minWidth: 60,
    textAlign: 'right',
  },
  activityCard: {
    marginBottom: 16,
    elevation: 2,
  },
  activityItem: {
    marginVertical: 2,
    paddingLeft: 8,
  },
  actionsCard: {
    marginBottom: 16,
    elevation: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  actionFab: {
    margin: 8,
  },
});