import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BetaSignupForm } from '@/components/beta/BetaSignupForm';
import { FeedbackForm } from '@/components/beta/FeedbackForm';
import { ReleaseNotes } from '@/components/beta/ReleaseNotes';
import { MyFeedback } from '@/components/beta/MyFeedback';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Apple, Smartphone, MessageSquare, FileText, History } from 'lucide-react';

export default function BetaPortal() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Beta Testing Portal</h1>
          <p className="text-muted-foreground">Help shape the future of AlaskaPay</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <Apple className="h-8 w-8 mb-2" />
              <CardTitle>iOS TestFlight</CardTitle>
              <CardDescription>Test on iPhone and iPad</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Get early access to iOS builds through Apple's TestFlight program.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Smartphone className="h-8 w-8 mb-2" />
              <CardTitle>Android Internal Testing</CardTitle>
              <CardDescription>Test on Android devices</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Join our internal testing track on Google Play Store.</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="signup" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
            <TabsTrigger value="releases">Releases</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
            <TabsTrigger value="history">My Feedback</TabsTrigger>
          </TabsList>

          <TabsContent value="signup">
            <BetaSignupForm />
          </TabsContent>

          <TabsContent value="releases">
            <ReleaseNotes />
          </TabsContent>

          <TabsContent value="feedback">
            <FeedbackForm />
          </TabsContent>

          <TabsContent value="history">
            <MyFeedback />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
