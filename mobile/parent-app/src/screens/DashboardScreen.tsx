import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Title, Paragraph, Button, Chip, FAB } from 'react-native-paper';

interface PendingProposal {
  id: string;
  studentName: string;
  vertical: string;
  amount: number;
  riskLevel: string;
  submittedAt: Date;
  scs: number;
}

export default function DashboardScreen({ navigation }: any) {
  const [pendingProposals, setPendingProposals] = useState<PendingProposal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingProposals();
  }, []);

  const fetchPendingProposals = async () => {
    try {
      // Mock data - in production, call LIGER approval API
      const mockData: PendingProposal[] = [
        {
          id: '1',
          studentName: 'Alice',
          vertical: 'stocks',
          amount: 100,
          riskLevel: 'Medium',
          submittedAt: new Date(),
          scs: 75.5
        },
        {
          id: '2', 
          studentName: 'Bob',
          vertical: 'real-estate',
          amount: 50,
          riskLevel: 'Low',
          submittedAt: new Date(),
          scs: 68.2
        }
      ];
      
      setPendingProposals(mockData);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch proposals:', error);
      Alert.alert('Error', 'Failed to load pending proposals');
      setLoading(false);
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Low': return '#4caf50';
      case 'Medium': return '#ff9800';
      case 'High': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Title>Loading...</Title>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Title>Parent Dashboard</Title>
            <Paragraph>
              You have {pendingProposals.length} proposals awaiting your review
            </Paragraph>
          </Card.Content>
        </Card>

        {pendingProposals.map((proposal) => (
          <Card key={proposal.id} style={styles.proposalCard}>
            <Card.Content>
              <View style={styles.proposalHeader}>
                <Title>{proposal.studentName}</Title>
                <Chip 
                  style={[styles.riskChip, { backgroundColor: getRiskColor(proposal.riskLevel) }]}
                  textStyle={{ color: 'white' }}
                >
                  {proposal.riskLevel} Risk
                </Chip>
              </View>
              
              <Paragraph>
                Wants to invest {proposal.amount} CTK in {proposal.vertical}
              </Paragraph>
              
              <Paragraph style={styles.scsText}>
                Student Credibility Score: {proposal.scs}/100
              </Paragraph>
              
              <View style={styles.buttonRow}>
                <Button 
                  mode="outlined" 
                  onPress={() => navigation.navigate('ProposalDetail', { proposalId: proposal.id })}
                  style={styles.button}
                >
                  Review Details
                </Button>
                <Button 
                  mode="contained"
                  onPress={() => navigation.navigate('Approval', { proposalId: proposal.id })}
                  style={styles.button}
                >
                  Quick Approve
                </Button>
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>

      <FAB
        style={styles.fab}
        icon="refresh"
        onPress={fetchPendingProposals}
      />
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
  summaryCard: {
    marginBottom: 16,
    elevation: 2,
  },
  proposalCard: {
    marginBottom: 16,
    elevation: 2,
  },
  proposalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  riskChip: {
    alignSelf: 'flex-start',
  },
  scsText: {
    fontWeight: 'bold',
    color: '#1976d2',
    marginVertical: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});