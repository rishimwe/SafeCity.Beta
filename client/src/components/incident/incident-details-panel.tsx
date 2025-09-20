import { useState } from "react";
import { X, MapPin, Flag, Share, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useIncident, useIncidentComments, useCreateComment, useIncidentRating } from "@/hooks/use-incidents";
import { INCIDENT_TYPES, SEVERITY_LEVELS } from "@/lib/types";
import { SmsAlertModal } from "@/components/sms/sms-alert-modal";

interface IncidentDetailsPanelProps {
  incidentId: string;
  onClose: () => void;
  isDesktop: boolean;
}

export default function IncidentDetailsPanel({ incidentId, onClose, isDesktop }: IncidentDetailsPanelProps) {
  const [newComment, setNewComment] = useState("");
  const [authorName, setAuthorName] = useState("");
  const { data: incident, isLoading: incidentLoading } = useIncident(incidentId);
  const { data: comments = [], isLoading: commentsLoading } = useIncidentComments(incidentId);
  const { data: rating } = useIncidentRating(incidentId);
  const createCommentMutation = useCreateComment(incidentId);

  if (incidentLoading || !incident) {
    return (
      <div className="fixed inset-y-0 right-0 bg-white shadow-2xl z-30 flex items-center justify-center w-full md:w-96">
        <div className="text-muted-foreground">Chargement...</div>
      </div>
    );
  }

  const typeConfig = INCIDENT_TYPES.find(t => t.key === incident.type) || INCIDENT_TYPES[3];
  const severityConfig = SEVERITY_LEVELS.find(s => s.key === incident.severity) || SEVERITY_LEVELS[0];

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays > 0) {
      return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    } else if (diffHours > 0) {
      return `Il y a ${diffHours}h`;
    } else {
      return "Il y a moins d'1h";
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !authorName.trim()) return;
    try {
      await createCommentMutation.mutateAsync({
        content: newComment,
        authorName: authorName,
      });
      setNewComment("");
      setAuthorName("");
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-warning fill-warning' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div
      className={`fixed inset-y-0 right-0 bg-white shadow-2xl transform transition-transform duration-300 z-30 overflow-y-auto custom-scrollbar
        ${isDesktop ? "w-1/4 max-w-md" : "w-full"}
      `}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-lg">Détails de l'incident</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 p-4">
          <div className="space-y-4">
            {/* Incident Header */}
            <div className="flex items-start space-x-3">
              <span
                className="w-4 h-4 rounded-full mt-1 flex-shrink-0"
                style={{ backgroundColor: typeConfig.color }}
              />
              <div className="flex-1">
                <h4 className="font-medium text-lg">{incident.title}</h4>
                <p className="text-sm text-muted-foreground">
                  Signalé {formatTimeAgo(incident.createdAt)}
                </p>
              </div>
            </div>
            {/* Location */}
            <div className="bg-muted p-3 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="font-medium">Localisation</span>
              </div>
              <p className="text-sm">{incident.location}</p>
            </div>
            {/* Description */}
            <div>
              <h5 className="font-medium mb-2">Description</h5>
              <p className="text-sm text-muted-foreground">{incident.description}</p>
            </div>
            {/* Severity & Category */}
            <div className="flex space-x-4">
              <div className="flex-1">
                <span className="text-xs text-muted-foreground block mb-1">Gravité</span>
                <Badge 
                  variant="secondary"
                  style={{ backgroundColor: severityConfig.color, color: 'white' }}
                >
                  {severityConfig.label}
                </Badge>
              </div>
              <div className="flex-1">
                <span className="text-xs text-muted-foreground block mb-1">Catégorie</span>
                <Badge variant="outline">{typeConfig.label}</Badge>
              </div>
            </div>
            {/* User Rating */}
            {rating && rating.count > 0 && (
              <div>
                <h5 className="font-medium mb-2">Fiabilité du signalement</h5>
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    {renderStars(rating.average)}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({rating.average.toFixed(1)}/5 - {rating.count} vote{rating.count > 1 ? 's' : ''})
                  </span>
                </div>
              </div>
            )}
            {/* Comments Section */}
            <div>
              <h5 className="font-medium mb-3">
                Commentaires ({comments.length})
              </h5>

              {commentsLoading ? (
                <div className="text-sm text-muted-foreground">Chargement des commentaires...</div>
              ) : comments.length === 0 ? (
                <div className="text-sm text-muted-foreground">Aucun commentaire pour le moment</div>
              ) : (
                <div className="space-y-3">
                  {comments.map(comment => (
                    <div key={comment.id} className="bg-muted p-3 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-xs text-white font-medium">
                            {comment.authorName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-sm font-medium">{comment.authorName}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatTimeAgo(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                  ))}
                </div>
              )}
              {/* Add Comment */}
              <div className="mt-4 space-y-3">
                <input
                  type="text"
                  placeholder="Votre nom"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                />
                <Textarea
                  placeholder="Ajouter un commentaire..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                />
                <Button
                  onClick={handleAddComment}
                  disabled={!newComment.trim() || !authorName.trim() || createCommentMutation.isPending}
                  className="bg-primary text-white hover:bg-primary-dark"
                >
                  {createCommentMutation.isPending ? 'Publication...' : 'Publier'}
                </Button>
              </div>
            </div>
          </div>
        </div>
        {/* Actions */}
        <div className="border-t p-4 space-y-2">
          <SmsAlertModal incident={incident} 
            trigger={
              <Button variant="default" className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                📱 Envoyer alerte SMS
              </Button>
            }
          />
          <Button variant="outline" className="w-full">
            <Flag className="mr-2 h-4 w-4" />
            Signaler ce contenu
          </Button>
          <Button className="w-full bg-primary text-white hover:bg-primary-dark">
            <Share className="mr-2 h-4 w-4" />
            Partager
          </Button>
        </div>
      </div>
    </div>
  );
}
