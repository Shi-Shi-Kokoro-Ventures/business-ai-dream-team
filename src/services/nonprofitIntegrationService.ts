
import { agentCommunication } from './agentCommunication';

interface GrantProject {
  id: string;
  name: string;
  funder: string;
  amount: number;
  deadline: Date;
  status: 'research' | 'drafting' | 'review' | 'submitted' | 'awarded' | 'rejected';
  trelloBoardId?: string;
  classroomCourseId?: string;
}

interface FundraisingCampaign {
  id: string;
  name: string;
  goal: number;
  currentAmount: number;
  platform: string;
  trelloCardId?: string;
  classroomAnnouncementId?: string;
}

class NonprofitIntegrationService {
  private grantProjects: Map<string, GrantProject> = new Map();
  private fundraisingCampaigns: Map<string, FundraisingCampaign> = new Map();

  // Grant Management Integration
  async createGrantProject(
    grantName: string, 
    funder: string, 
    amount: number, 
    deadline: Date
  ): Promise<GrantProject> {
    const project: GrantProject = {
      id: `grant_${Date.now()}`,
      name: grantName,
      funder,
      amount,
      deadline,
      status: 'research'
    };

    // Create Trello board for grant tracking
    const board = await agentCommunication.createGrantTrackingBoard('grant-expert', grantName);
    if (board.success) {
      project.trelloBoardId = board.data.id;
    }

    // Create Google Classroom course for team collaboration
    const course = await agentCommunication.createEducationalCourse(
      'grant-expert',
      `Grant Team: ${grantName}`,
      `Collaborative workspace for ${grantName} grant application and management`
    );
    if (course.success) {
      project.classroomCourseId = course.data.id;
    }

    this.grantProjects.set(project.id, project);
    console.log(`✅ Grant project created: ${grantName} with Trello and Classroom integration`);

    return project;
  }

  async updateGrantStatus(projectId: string, newStatus: GrantProject['status'], notes?: string) {
    const project = this.grantProjects.get(projectId);
    if (!project) throw new Error('Grant project not found');

    project.status = newStatus;

    // Update Trello board
    if (project.trelloBoardId) {
      await agentCommunication.updateTrelloBoard(
        'grant-expert',
        'createCard',
        project.trelloBoardId,
        undefined,
        undefined,
        {
          name: `Status Update: ${newStatus}`,
          description: `Grant status updated to ${newStatus}${notes ? `\n\nNotes: ${notes}` : ''}`,
          dueDate: project.deadline
        }
      );
    }

    // Post announcement in Classroom
    if (project.classroomCourseId) {
      await agentCommunication.postGrantUpdateAnnouncement(
        'grant-expert',
        project.classroomCourseId,
        newStatus,
        notes || 'Status updated by AI Grant Expert'
      );
    }

    this.grantProjects.set(projectId, project);
    return project;
  }

  // Fundraising Campaign Integration
  async createFundraisingCampaign(
    campaignName: string,
    goal: number,
    platform: string
  ): Promise<FundraisingCampaign> {
    const campaign: FundraisingCampaign = {
      id: `campaign_${Date.now()}`,
      name: campaignName,
      goal,
      currentAmount: 0,
      platform
    };

    // Create Trello card for campaign tracking
    const card = await agentCommunication.updateTrelloBoard(
      'digital-fundraising',
      'createCard',
      undefined,
      undefined,
      undefined,
      {
        name: `Fundraising: ${campaignName}`,
        description: `Goal: $${goal.toLocaleString()}\nPlatform: ${platform}\nStatus: Active`,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      }
    );

    if (card.success) {
      campaign.trelloCardId = card.data.id;
    }

    this.fundraisingCampaigns.set(campaign.id, campaign);
    console.log(`✅ Fundraising campaign created: ${campaignName} with tracking integration`);

    return campaign;
  }

  async updateCampaignProgress(campaignId: string, newAmount: number, notes?: string) {
    const campaign = this.fundraisingCampaigns.get(campaignId);
    if (!campaign) throw new Error('Fundraising campaign not found');

    campaign.currentAmount = newAmount;
    const progressPercent = Math.round((newAmount / campaign.goal) * 100);

    // Update Trello card
    if (campaign.trelloCardId) {
      await agentCommunication.updateTrelloBoard(
        'digital-fundraising',
        'updateCard',
        undefined,
        undefined,
        campaign.trelloCardId,
        {
          desc: `Goal: $${campaign.goal.toLocaleString()}\nCurrent: $${newAmount.toLocaleString()} (${progressPercent}%)\nPlatform: ${campaign.platform}\n\n${notes || ''}`
        }
      );

      // Add progress comment
      await agentCommunication.updateTrelloBoard(
        'digital-fundraising',
        'addComment',
        undefined,
        undefined,
        campaign.trelloCardId,
        {
          text: `💰 Progress Update: $${newAmount.toLocaleString()} raised (${progressPercent}% of goal)\n${notes || ''}`
        }
      );
    }

    this.fundraisingCampaigns.set(campaignId, campaign);
    return campaign;
  }

  // Cross-platform automation
  async automateGrantToFundraising(projectId: string) {
    const project = this.grantProjects.get(projectId);
    if (!project) throw new Error('Grant project not found');

    if (project.status === 'rejected') {
      // Automatically create alternative fundraising campaign
      const campaign = await this.createFundraisingCampaign(
        `Alternative Funding: ${project.name}`,
        project.amount,
        'Crowdfunding'
      );

      console.log(`🔄 Automated: Created alternative fundraising campaign for rejected grant ${project.name}`);
      return campaign;
    }

    return null;
  }

  // Analytics and Reporting
  async generateNonprofitMetrics() {
    const totalGrants = this.grantProjects.size;
    const approvedGrants = Array.from(this.grantProjects.values()).filter(p => p.status === 'awarded').length;
    const totalFundingGoal = Array.from(this.fundraisingCampaigns.values()).reduce((sum, c) => sum + c.goal, 0);
    const totalFundingRaised = Array.from(this.fundraisingCampaigns.values()).reduce((sum, c) => sum + c.currentAmount, 0);

    return {
      grants: {
        total: totalGrants,
        approved: approvedGrants,
        successRate: totalGrants > 0 ? Math.round((approvedGrants / totalGrants) * 100) : 0
      },
      fundraising: {
        totalGoal: totalFundingGoal,
        totalRaised: totalFundingRaised,
        progressPercent: totalFundingGoal > 0 ? Math.round((totalFundingRaised / totalFundingGoal) * 100) : 0
      }
    };
  }

  // Getters for data access
  getGrantProjects(): GrantProject[] {
    return Array.from(this.grantProjects.values());
  }

  getFundraisingCampaigns(): FundraisingCampaign[] {
    return Array.from(this.fundraisingCampaigns.values());
  }

  getGrantProject(id: string): GrantProject | undefined {
    return this.grantProjects.get(id);
  }

  getFundraisingCampaign(id: string): FundraisingCampaign | undefined {
    return this.fundraisingCampaigns.get(id);
  }
}

export const nonprofitIntegrationService = new NonprofitIntegrationService();
